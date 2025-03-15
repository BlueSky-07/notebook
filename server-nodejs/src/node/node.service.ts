import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NodeEntity } from './node.entity';
import { NodeAddInput, NodePatchInput } from './node.type';
import { FlowEntity } from '../flow/flow.entity';
import { InngestService } from '../inngest/inngest.service';
import FlowUpdatedFunction from '../inngest/functions/flow-updated';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(NodeEntity)
    private nodeRepository: Repository<NodeEntity>,
    @Inject(forwardRef(() => InngestService))
    private inngestService: InngestService,
  ) {}

  async addNode(nodeAddInput: NodeAddInput): Promise<NodeEntity['id']> {
    const res = await this.nodeRepository.insert({
      ...nodeAddInput,
      updatedAt: new Date(),
    });
    await FlowUpdatedFunction.trigger(this.inngestService.inngest, {
      flowId: nodeAddInput.flowId,
    });
    return res.generatedMaps[0].id;
  }

  async patchNode(
    id: NodeEntity['id'],
    nodePatchInput: NodePatchInput,
  ): Promise<NodeEntity> {
    const record = await this.getNode(id);
    const res = await this.nodeRepository.update(id, {
      ...nodePatchInput,
      updatedAt: new Date(),
    });
    if (res.affected) {
      await FlowUpdatedFunction.trigger(this.inngestService.inngest, {
        flowId: record.flowId,
      });
      return this.getNode(id);
    } else {
      throw new InternalServerErrorException(
        `Node does not update successfully`,
      );
    }
  }

  async getNode(id: NodeEntity['id']): Promise<NodeEntity> {
    const record = await this.nodeRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Node does not exist: ${id}`);
    }
    return record;
  }

  getNodesByIds(ids: NodeEntity['id'][]): Promise<NodeEntity[]> {
    if (!ids.length) return Promise.resolve([] as NodeEntity[])
    return this.nodeRepository.find({
      where: {
        id: In(ids)
      }
    });
  }

  getNodesByFlowId(flowId: FlowEntity['id']): Promise<NodeEntity[]> {
    return this.nodeRepository.findBy({
      flowId,
    });
  }

  async deleteNode(id: NodeEntity['id']): Promise<boolean> {
    const record = await this.getNode(id);
    const res = await this.nodeRepository.delete({
      id,
    });
    if (res.affected) {
      await FlowUpdatedFunction.trigger(this.inngestService.inngest, {
        flowId: record.flowId,
      });
      return true;
    } else {
      throw new InternalServerErrorException(
        `Node does not delete successfully`,
      );
    }
  }
}
