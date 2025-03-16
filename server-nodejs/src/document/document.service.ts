import { Injectable } from '@nestjs/common';
import { FlowService } from '../flow/flow.service';
import { DocumentSlim, DocumentFull } from './document.type';
import { NodeService } from '../node/node.service';
import { EdgeService } from '../edge/edge.service';
import { FlowEntity } from '../flow/flow.entity';

@Injectable()
export class DocumentService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nodeService: NodeService,
    private readonly edgeService: EdgeService,
  ) {}

  async getDocumentFull(flowId: FlowEntity['id']): Promise<DocumentFull> {
    const flowRecord = await this.flowService.getFlow(flowId);
    const nodeRecords = await this.nodeService.getNodesByFlowId(flowId);
    const edgeRecords = await this.edgeService.getEdgesByFlowId(flowId);

    return {
      flowId,
      name: flowRecord.name,
      author: flowRecord.author,
      updatedAt: flowRecord.updatedAt,
      nodes: nodeRecords,
      edges: edgeRecords,
    };
  }

  async getDocumentSlim(flowId: FlowEntity['id']): Promise<DocumentSlim> {
    const documentFull = await this.getDocumentFull(flowId);

    return {
      flowId,
      name: documentFull.name,
      author: documentFull.author,
      updatedAt: documentFull.updatedAt,
      nodeIds: documentFull.nodes.map((node) => node.id),
      edgeIds: documentFull.edges.map((edge) => edge.id),
    };
  }
}
