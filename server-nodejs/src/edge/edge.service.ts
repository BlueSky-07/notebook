import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdgeEntity } from './edge.entity';
import { EdgeAddInput, EdgePatchInput } from './edge.type';
import { FlowEntity } from '../flow/flow.entity';
import { InngestService } from '../inngest/inngest.service';
import FlowUpdatedFunction from '../inngest/functions/flow-updated';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(EdgeEntity)
    private edgeRepository: Repository<EdgeEntity>,
    private inngestService: InngestService,
  ) {}

  async addEdge(edgeAddInput: EdgeAddInput): Promise<EdgeEntity['id']> {
    const res = await this.edgeRepository.insert({
      ...edgeAddInput,
      updatedAt: new Date(),
    });
    FlowUpdatedFunction.trigger(this.inngestService.inngest, {
      flowId: edgeAddInput.flowId,
    });
    return res.generatedMaps[0].id;
  }

  async patchEdge(
    id: EdgeEntity['id'],
    edgePatchInput: EdgePatchInput,
  ): Promise<EdgeEntity> {
    const record = await this.getEdge(id);
    const res = await this.edgeRepository.update(id, {
      ...edgePatchInput,
      updatedAt: new Date(),
    });
    if (res.affected) {
      FlowUpdatedFunction.trigger(this.inngestService.inngest, {
        flowId: record.flowId,
      });
      return this.getEdge(id);
    } else {
      throw new InternalServerErrorException(
        `Edge does not update successfully`,
      );
    }
  }

  async getEdge(id: EdgeEntity['id']): Promise<EdgeEntity> {
    const record = await this.edgeRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Edge does not exist: ${id}`);
    }
    return record;
  }

  getEdgesByFlowId(flowId: FlowEntity['id']): Promise<EdgeEntity[]> {
    return this.edgeRepository.findBy({
      flowId,
    });
  }

  async deleteEdge(id: EdgeEntity['id']): Promise<boolean> {
    const record = await this.getEdge(id);
    const res = await this.edgeRepository.delete({
      id,
    });
    if (res.affected) {
      FlowUpdatedFunction.trigger(this.inngestService.inngest, {
        flowId: record.flowId,
      });
      return true;
    } else {
      throw new InternalServerErrorException(
        `Edge does not delete successfully`,
      );
    }
  }
}
