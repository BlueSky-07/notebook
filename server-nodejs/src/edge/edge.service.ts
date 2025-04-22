import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EdgeEntity } from './edge.entity';
import {
  BatchEdgePatchInputItem,
  EdgeAddInput,
  EdgePatchInput,
} from './edge.dto';
import { FlowEntity } from '../flow/flow.entity';
import { InngestService } from '../inngest/inngest.service';
import { omit } from 'lodash';
import EdgeEvent from './edge.event';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(EdgeEntity)
    private readonly edgeRepository: Repository<EdgeEntity>,
    @Inject(forwardRef(() => InngestService))
    private readonly inngestService: InngestService,
  ) {}

  async addEdge(edgeAddInput: EdgeAddInput): Promise<EdgeEntity['id']> {
    const res = await this.edgeRepository.insert(edgeAddInput);
    const edgeId = res.generatedMaps[0].id as number;
    await EdgeEvent.trigger(
      this.inngestService.inngest,
      EdgeEvent.EVENT_NAMES.EDGE_CREATED,
      {
        edgeId,
        flowId: edgeAddInput.flowId,
      },
    );
    return edgeId;
  }

  async patchEdge(
    id: EdgeEntity['id'],
    edgePatchInput: EdgePatchInput,
  ): Promise<EdgeEntity> {
    const record = await this.getEdge(id);
    const res = await this.edgeRepository.update(id, edgePatchInput);
    if (res.affected) {
      await EdgeEvent.trigger(
        this.inngestService.inngest,
        EdgeEvent.EVENT_NAMES.EDGE_UPDATED,
        {
          edgeId: record.id,
          flowId: record.flowId,
        },
      );
      return this.getEdge(id);
    } else {
      throw new InternalServerErrorException(
        `Edge does not update successfully`,
      );
    }
  }

  async getEdge(id: EdgeEntity['id']): Promise<EdgeEntity> {
    if (!id) throw new BadRequestException(`Edge id is missing`);
    const record = await this.edgeRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Edge does not exist: ${id}`);
    }
    return record;
  }

  getEdgesByIds(ids: EdgeEntity['id'][]): Promise<EdgeEntity[]> {
    if (!ids.length) return Promise.resolve([] as EdgeEntity[]);
    return this.edgeRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  getEdgesByFlowId(flowId: FlowEntity['id']): Promise<EdgeEntity[]> {
    return this.edgeRepository.findBy({
      flowId,
    });
  }

  countEdgesByFlowId(flowId: FlowEntity['id']): Promise<number> {
    return this.edgeRepository.countBy({
      flowId,
    });
  }

  async deleteEdge(id: EdgeEntity['id']): Promise<boolean> {
    const record = await this.getEdge(id);
    const res = await this.edgeRepository.delete({
      id,
    });
    if (res.affected) {
      await EdgeEvent.trigger(
        this.inngestService.inngest,
        EdgeEvent.EVENT_NAMES.EDGE_DELETED,
        {
          edgeId: record.id,
          flowId: record.flowId,
        },
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Edge does not delete successfully`,
      );
    }
  }

  async addEdges(edges: EdgeAddInput[]): Promise<EdgeEntity['id'][]> {
    const res = await this.edgeRepository.insert(edges);
    const ids = res.generatedMaps.map((item) => item.id as number);
    await Promise.all(
      ids.map((id, index) =>
        EdgeEvent.trigger(
          this.inngestService.inngest,
          EdgeEvent.EVENT_NAMES.EDGE_CREATED,
          {
            edgeId: id,
            flowId: edges[index].flowId,
          },
        ),
      ),
    );

    return ids;
  }

  async patchEdges(
    batchEdgePatchInputItems: BatchEdgePatchInputItem[],
  ): Promise<EdgeEntity[]> {
    const edgeIdPatchInputMapping = new Map<
      EdgeEntity['id'],
      BatchEdgePatchInputItem
    >();
    for (const batchEdgePatchInputItem of batchEdgePatchInputItems) {
      edgeIdPatchInputMapping.set(
        batchEdgePatchInputItem.id,
        batchEdgePatchInputItem,
      );
    }
    return Promise.all(
      Array.from(edgeIdPatchInputMapping.values()).map((item) =>
        this.patchEdge(item.id, omit(item, 'id')),
      ),
    );
  }

  async deleteEdgesByIds(ids: EdgeEntity['id'][]): Promise<boolean> {
    const filteredIds = Array.from(new Set(ids));
    const records = await this.getEdgesByIds(filteredIds);
    if (!records.length) throw new BadRequestException(`Edges do not exist`);
    const res = await this.edgeRepository.delete({
      id: In(filteredIds),
    });
    if (res.affected) {
      await Promise.all(
        records.map((record) =>
          EdgeEvent.trigger(
            this.inngestService.inngest,
            EdgeEvent.EVENT_NAMES.EDGE_DELETED,
            {
              edgeId: record.id,
              flowId: record.flowId,
            },
          ),
        ),
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Edges does not delete successfully`,
      );
    }
  }

  async deleteEdgesByFlowId(flowId: FlowEntity['id']): Promise<boolean> {
    const records = await this.getEdgesByFlowId(flowId);
    if (!records.length) throw new BadRequestException(`Edges do not exist`);
    const res = await this.edgeRepository.delete({
      flowId,
    });
    if (res.affected) {
      await Promise.all(
        records.map((record) =>
          EdgeEvent.trigger(
            this.inngestService.inngest,
            EdgeEvent.EVENT_NAMES.EDGE_DELETED,
            {
              edgeId: record.id,
              flowId: record.flowId,
            },
          ),
        ),
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Edges does not delete successfully`,
      );
    }
  }

  async deleteEdgesByNodeId(
    dryRun = true,
    nodeId: EdgeEntity['id'],
  ): Promise<EdgeEntity['id'][]> {
    const records = await this.edgeRepository.find({
      where: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
    });
    if (!records.length) return [];
    if (dryRun) return records.map((record) => record.id);
    const res = await this.edgeRepository.delete({
      id: In(records.map((record) => record.id)),
    });
    if (res.affected) {
      const deletedEdgeIds: EdgeEntity['id'][] = records.map(
        (record) => record.id,
      );
      await Promise.all(
        records.map((record) =>
          EdgeEvent.trigger(
            this.inngestService.inngest,
            EdgeEvent.EVENT_NAMES.EDGE_DELETED,
            {
              edgeId: record.id,
              flowId: record.flowId,
            },
          ),
        ),
      );
      return deletedEdgeIds;
    } else {
      return [];
    }
  }
}
