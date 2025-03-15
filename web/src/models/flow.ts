import { MarkerType, type Edge, type Node } from '@xyflow/react'
import { EdgeEntity, NodeEntity, NodeDataTypeEnum, DocumentFull, EdgeDataTypeEnum, EdgeHandleEnum } from '@api/models'

export interface FlowModel {
  nodes: Node[]
  edges: Edge[]
}

export const DEFAULT_FLOW_MODEL: FlowModel = {
  nodes: [],
  edges: [],
}

export function getFlowNode(
  id: string,
  dataType: NodeEntity['dataType'] = NodeDataTypeEnum.Text
): Node {
  return {
    id,
    position: {
      x: 0,
      y: 0
    },
    data: {
      ...dataType === NodeDataTypeEnum.Text && {
        content: ''
      },
      ...dataType === NodeDataTypeEnum.Image && {
        src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'
      },
    },
    type: dataType,
  }
}

export function getFlowEdge(
  id: string,
  source: string, target: string,
  sourceHandle: string, targetHandle: string,
  dataType: EdgeEntity['dataType'] = EdgeDataTypeEnum.Label
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    data: {
      ...dataType === EdgeDataTypeEnum.Label && {
        label: ''
      },
    },
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
    target: edgeEntity.targetNodeId.toString(),
    sourceHandle: edgeEntity.sourceHandle,
    targetHandle: edgeEntity.targetHandle,
    data: edgeEntity.data as Edge['data'],
    type: edgeEntity.dataType,
    markerEnd: {
      type: MarkerType.Arrow,
      width: 40,
      height: 40,
      orient: {
        [EdgeHandleEnum.Left]: 'horizontal',
        // [EdgeHandleEnum.Top]: 'vertical'
      }[edgeEntity.targetHandle]
    },
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
    sourceHandle: flowEdge.sourceHandle as EdgeEntity['sourceHandle'],
    targetHandle: flowEdge.targetHandle as EdgeEntity['targetHandle'],
    data: flowEdge.data,
    dataType: flowEdge.type as EdgeEntity['dataType']
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