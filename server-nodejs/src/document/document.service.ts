import { Injectable, NotFoundException } from '@nestjs/common'
import { FlowService } from '../flow/flow.service'
import { DocumentSlim, DocumentFull } from './document.type'
import { NodeService } from '../node/node.service'
import { EdgeService } from '../edge/edge.service'
import { FlowEntity } from '../flow/flow.entity'

@Injectable()
export class DocumentService {
  constructor(
    private flowService: FlowService,
    private nodeService: NodeService,
    private edgeService: EdgeService
  ) {
  }

  async getDocumentFull(flowId: FlowEntity['id']): Promise<DocumentFull> {
    const flowRecord = await this.flowService.getFlow(flowId)
    const nodeRecords = await this.nodeService.getNodesByFlowId(flowId)
    const edgeRecords = await this.edgeService.getEdgesByFlowId(flowId)

    return {
      flowId,
      name: flowRecord.name,
      author: flowRecord.author,
      updatedAt: flowRecord.updatedAt,
      nodes: nodeRecords,
      edges: edgeRecords
    }
  }

  async getDocumentSlim(flowId: FlowEntity['id']): Promise<DocumentSlim> {
    const documentFull = await this.getDocumentFull(flowId)

    return {
      flowId,
      name: documentFull.name,
      author: documentFull.author,
      updatedAt: documentFull.updatedAt,
      nodeIds: documentFull.nodes.map(node => node.id),
      edgeIds: documentFull.edges.map(node => node.id),
    }
  }
}
