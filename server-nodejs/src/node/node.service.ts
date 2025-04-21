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
import { NodeDataType, NodeEntity } from './node.entity';
import {
  BatchNodePatchInputItem,
  NodeAddInput,
  NodePatchInput,
} from './node.dto';
import { FlowEntity } from '../flow/flow.entity';
import { InngestService } from '../inngest/inngest.service';
import { omit } from 'lodash';
import NodeEvent from './node.event';
import { extractImageLinksFromMarkdown } from '../utils/markdown';
import { FileEntity } from '../file/file.entity';
import { extractFileFromLink } from '../file/file.helper';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(NodeEntity)
    private readonly nodeRepository: Repository<NodeEntity>,
    @Inject(forwardRef(() => InngestService))
    private readonly inngestService: InngestService,
  ) {}

  async addNode(nodeAddInput: NodeAddInput): Promise<NodeEntity['id']> {
    const res = await this.nodeRepository.insert(nodeAddInput);
    const nodeId = res.generatedMaps[0].id as number;
    await NodeEvent.trigger(
      this.inngestService.inngest,
      NodeEvent.EVENT_NAMES.NODE_CREATED,
      {
        nodeId,
        flowId: nodeAddInput.flowId,
      },
    );
    return nodeId;
  }

  async patchNode(
    id: NodeEntity['id'],
    nodePatchInput: NodePatchInput,
  ): Promise<NodeEntity> {
    const record = await this.getNode(id);
    const res = await this.nodeRepository.update(id, nodePatchInput);
    if (res.affected) {
      await NodeEvent.trigger(
        this.inngestService.inngest,
        NodeEvent.EVENT_NAMES.NODE_UPDATED,
        {
          nodeId: id,
          flowId: record.flowId,
        },
      );
      return this.getNode(id);
    } else {
      throw new InternalServerErrorException(
        `Node does not update successfully`,
      );
    }
  }

  async getNode(id: NodeEntity['id']): Promise<NodeEntity> {
    if (!id) throw new BadRequestException(`Node id is missing`);
    const record = await this.nodeRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Node does not exist: ${id}`);
    }
    return record;
  }

  getNodesByIds(ids: NodeEntity['id'][]): Promise<NodeEntity[]> {
    if (!ids.length) return Promise.resolve([] as NodeEntity[]);
    return this.nodeRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  getNodesByFlowId(flowId: FlowEntity['id']): Promise<NodeEntity[]> {
    return this.nodeRepository.findBy({
      flowId,
    });
  }

  countNodesByFlowId(flowId: FlowEntity['id']): Promise<number> {
    return this.nodeRepository.countBy({
      flowId,
    });
  }

  async deleteNode(id: NodeEntity['id']): Promise<boolean> {
    const record = await this.getNode(id);
    const res = await this.nodeRepository.delete({
      id,
    });
    if (res.affected) {
      await NodeEvent.trigger(
        this.inngestService.inngest,
        NodeEvent.EVENT_NAMES.NODE_DELETED,
        {
          nodeId: id,
          flowId: record.flowId,
        },
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Node does not delete successfully`,
      );
    }
  }

  async addNodes(nodes: NodeAddInput[]): Promise<NodeEntity['id'][]> {
    const res = await this.nodeRepository.insert(nodes);
    const ids = res.generatedMaps.map((generated) => generated.id as number);
    await Promise.all(
      ids.map((id, index) =>
        NodeEvent.trigger(
          this.inngestService.inngest,
          NodeEvent.EVENT_NAMES.NODE_CREATED,
          {
            nodeId: id,
            flowId: nodes[index].flowId,
          },
        ),
      ),
    );

    return ids;
  }

  async patchNodes(
    batchNodePatchInputItems: BatchNodePatchInputItem[],
  ): Promise<NodeEntity[]> {
    const nodeIdPatchInputMapping = new Map<
      NodeEntity['id'],
      BatchNodePatchInputItem
    >();
    for (const nodePatchInputItem of batchNodePatchInputItems) {
      nodeIdPatchInputMapping.set(nodePatchInputItem.id, nodePatchInputItem);
    }
    return Promise.all(
      Array.from(nodeIdPatchInputMapping.values()).map((item) =>
        this.patchNode(item.id, omit(item, 'id')),
      ),
    );
  }

  async deleteNodesByIds(ids: NodeEntity['id'][]): Promise<boolean> {
    const filteredIds = Array.from(new Set(ids));
    const records = await this.getNodesByIds(filteredIds);
    if (!records.length) throw new BadRequestException(`Nodes do not exist`);
    const res = await this.nodeRepository.delete({
      id: In(filteredIds),
    });
    if (res.affected) {
      await Promise.all(
        records.map((record) =>
          NodeEvent.trigger(
            this.inngestService.inngest,
            NodeEvent.EVENT_NAMES.NODE_DELETED,
            {
              nodeId: record.id,
              flowId: record.flowId,
            },
          ),
        ),
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Nodes does not delete successfully`,
      );
    }
  }

  async deleteNodesByFlowId(flowId: FlowEntity['id']): Promise<boolean> {
    const records = await this.getNodesByFlowId(flowId);
    if (!records.length) throw new BadRequestException(`Nodes do not exist`);
    const res = await this.nodeRepository.delete({
      flowId,
    });
    if (res.affected) {
      await Promise.all(
        records.map((record) =>
          NodeEvent.trigger(
            this.inngestService.inngest,
            NodeEvent.EVENT_NAMES.NODE_DELETED,
            {
              nodeId: record.id,
              flowId: record.flowId,
            },
          ),
        ),
      );
      return true;
    } else {
      throw new InternalServerErrorException(
        `Nodes does not delete successfully`,
      );
    }
  }

  async extractFileIdsFromNodeData(
    nodeRecord: NodeEntity,
  ): Promise<FileEntity['id'][]> {
    const fileIds: FileEntity['id'][] = [];
    switch (nodeRecord.dataType) {
      case NodeDataType.Text: {
        const markdown = nodeRecord.data.content;
        const images = await extractImageLinksFromMarkdown(markdown);
        for (const image of images) {
          const extracted = extractFileFromLink(image);
          if (extracted?.id) fileIds.push(extracted.id);
        }
        break;
      }
      case NodeDataType.Image: {
        const image = nodeRecord.data.src;
        const extracted = extractFileFromLink(image);
        if (extracted?.id) fileIds.push(extracted.id);
        break;
      }
    }
    return fileIds;
  }
}
