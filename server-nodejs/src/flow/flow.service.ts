import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FlowEntity } from './flow.entity';
import {
  FlowAddInput,
  FlowFull,
  FlowListInput,
  FlowListResponse,
  FlowPatchInput,
} from './flow.dto';
import { convertListInputPaginationToFindOptions } from '../utils/pagination';
import { NodeService } from '../node/node.service';
import { EdgeService } from '../edge/edge.service';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(FlowEntity)
    private readonly flowRepository: Repository<FlowEntity>,
    private readonly nodeService: NodeService,
    private readonly edgeService: EdgeService,
  ) {}

  async getFlowFull(id: FlowEntity['id']): Promise<FlowFull> {
    if (!id) throw new BadRequestException(`Flow id is missing`);
    const flowRecord = await this.getFlow(id);
    const nodeRecords = await this.nodeService.getNodesByFlowId(id);
    const edgeRecords = await this.edgeService.getEdgesByFlowId(id);

    return {
      flowId: id,
      name: flowRecord.name,
      updatedAt: flowRecord.updatedAt,
      nodes: nodeRecords,
      edges: edgeRecords,
    };
  }

  async addFlow(flowAddInput: FlowAddInput): Promise<FlowEntity['id']> {
    const res = await this.flowRepository.insert(flowAddInput);
    return res.generatedMaps[0].id as number;
  }

  async patchFlow(
    id: FlowEntity['id'],
    flowPatchInput: FlowPatchInput,
  ): Promise<FlowEntity> {
    await this.getFlow(id);
    const res = await this.flowRepository.update(id, flowPatchInput);
    if (res.affected) {
      return this.getFlow(id);
    } else {
      throw new InternalServerErrorException(
        `Flow does not update successfully`,
      );
    }
  }

  async getFlow(id: FlowEntity['id']): Promise<FlowEntity> {
    if (!id) throw new BadRequestException(`Flow id is missing`);
    const record = await this.flowRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Flow does not exist: ${id}`);
    }
    return record;
  }

  async getAllFlows(flowListInput: FlowListInput): Promise<FlowListResponse> {
    const paginationOptions =
      convertListInputPaginationToFindOptions(flowListInput);
    const [flows, count] = await this.flowRepository.findAndCount({
      where: {
        ...(flowListInput.keyword
          ? {
              name: Like(`%${flowListInput.keyword.trim()}%`),
            }
          : undefined),
      },
      ...paginationOptions,
    });
    const items: FlowListResponse['items'] = [...flows];
    if (flowListInput.populateCount) {
      for (const item of items) {
        item.nodeCount = await this.nodeService.countNodesByFlowId(item.id);
        item.edgeCount = await this.edgeService.countEdgesByFlowId(item.id);
      }
    }
    return {
      items,
      count,
    };
  }

  async deleteFlow(id: FlowEntity['id']): Promise<boolean> {
    await this.getFlow(id);
    const res = await this.flowRepository.delete({
      id,
    });
    await this.nodeService.deleteNodesByFlowId(id);
    await this.edgeService.deleteEdgesByFlowId(id);
    if (res.affected) {
      return true;
    } else {
      throw new InternalServerErrorException(
        `Flow does not delete successfully`,
      );
    }
  }
}
