import { type Edge, type Node } from '@xyflow/react'
import { EdgeEntity, NodeEntity, NodeDataTypeEnum, DocumentFull } from '@api/models'

export interface FlowModel {
  nodes: Node[]
  edges: Edge[]
}

export const DEFAULT_FLOW_MODEL: FlowModel = {
  nodes: [],
  edges: [],
}

export function getFlowNode(
  id: number,
  dataType: NodeEntity['dataType'] = NodeDataTypeEnum.Text
): Node {
  return {
    id: id.toString(),
    position: {
      x: 0,
      y: 0
    },
    data: { content: '' },
    type: dataType,
  }
}

export function convertNodeEntityToFlowNode(
  nodeEntity: NodeEntity
): Node {
  return {
    id: nodeEntity.id.toString(),
    position: {
      x: nodeEntity.positionX,
      y: nodeEntity.positionY
    },
    data: nodeEntity.data as Node['data'],
    type: nodeEntity.dataType
  }
}

export function convertFlowNodeToNodeEntity(
  flowNode: Node,
  flowId: number
): Omit<NodeEntity, 'updatedAt'> {
  return {
    id: parseInt(flowNode.id, 10),
    flowId,
    positionX: flowNode.position.x,
    positionY: flowNode.position.y,
    data: flowNode.data,
    dataType: flowNode.type as NodeEntity['dataType']
  }
}

export function convertEdgeEntityToFlowEdge(
  edgeEntity: EdgeEntity
): Edge {
  return {
    id: edgeEntity.id.toString(),
    source: edgeEntity.sourceNodeId.toString(),
    target: edgeEntity.targetNodeId.toString()
  }
}

export function convertFlowEdgeToEdgeEntity(
  flowEdge: Edge,
  flowId: number
): Omit<EdgeEntity, 'updatedAt'> {
  return {
    id: parseInt(flowEdge.id, 10),
    flowId,
    sourceNodeId: parseInt(flowEdge.source, 10),
    targetNodeId: parseInt(flowEdge.target, 10),
  }
}

export function convertFullDocumentToFlowModel(
  fullDocument: DocumentFull,
): FlowModel {
  return {
    nodes: fullDocument.nodes.map(convertNodeEntityToFlowNode),
    edges: fullDocument.edges.map(convertEdgeEntityToFlowEdge),
  }
}