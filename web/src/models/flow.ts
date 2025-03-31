import { MarkerType, type Edge, type Node } from '@xyflow/react';
import {
  EdgeEntity,
  NodeEntity,
  NodeDataTypeEnum,
  EdgeDataTypeEnum,
  EdgeHandleEnum,
  FlowFull,
} from '@api/models';
import { sample } from 'lodash-es';

export interface FlowModel {
  nodes: Node[];
  edges: Edge[];
}

export const DEFAULT_FLOW_MODEL: FlowModel = {
  nodes: [],
  edges: [],
};

export function getInitialFlowNode(
  id: string,
  dataType: NodeEntity['dataType'] = NodeDataTypeEnum.Text,
): Node {
  return {
    id,
    position: {
      x: 0,
      y: 0,
    },
    width: 500,
    height: 300,
    data: {
      ...(dataType === NodeDataTypeEnum.Text && {
        content: '',
      }),
      ...(dataType === NodeDataTypeEnum.Image && {
        src: sample([
          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp',
        ]),
      }),
    },
    type: dataType,
  };
}

export function getInitialFlowEdge(
  id: string,
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string,
  dataType: EdgeEntity['dataType'] = EdgeDataTypeEnum.Label,
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    data: {
      ...(dataType === EdgeDataTypeEnum.Label && {
        label: '',
      }),
    },
    type: dataType,
  };
}

export function convertNodeEntityToFlowNode(nodeEntity: NodeEntity): Node {
  return {
    id: nodeEntity.id.toString(),
    position: {
      x: nodeEntity.layout.positionX,
      y: nodeEntity.layout.positionY,
    },
    width: nodeEntity.layout.width,
    height: nodeEntity.layout.height,
    data: {
      ...nodeEntity.data,
      $state: nodeEntity.state,
    } as Node['data'],
    type: nodeEntity.dataType,
  };
}

export function convertFlowNodeToNodeEntity(
  flowNode: Node,
  flowId: number,
): Omit<NodeEntity, 'updatedAt' | 'state'> {
  return {
    id: parseInt(flowNode.id, 10),
    flowId,
    layout: {
      positionX: flowNode.position.x,
      positionY: flowNode.position.y,
      width: flowNode.width,
      height: flowNode.height,
    },
    data: flowNode.data,
    dataType: flowNode.type as NodeEntity['dataType'],
  };
}

export function convertEdgeEntityToFlowEdge(edgeEntity: EdgeEntity): Edge {
  return {
    id: edgeEntity.id.toString(),
    source: edgeEntity.sourceNodeId.toString(),
    target: edgeEntity.targetNodeId.toString(),
    sourceHandle: edgeEntity.layout.sourceHandle,
    targetHandle: edgeEntity.layout.targetHandle,
    data: edgeEntity.data as Edge['data'],
    type: edgeEntity.dataType,
    markerEnd: {
      type: MarkerType.Arrow,
      width: 40,
      height: 40,
      orient: {
        [EdgeHandleEnum.Left]: 'horizontal',
        // [EdgeHandleEnum.Top]: 'vertical'
      }[edgeEntity.layout.targetHandle] as string,
    },
  };
}

export function convertFlowEdgeToEdgeEntity(
  flowEdge: Edge,
  flowId: number,
): Omit<EdgeEntity, 'updatedAt'> {
  return {
    id: parseInt(flowEdge.id, 10),
    flowId,
    sourceNodeId: parseInt(flowEdge.source, 10),
    targetNodeId: parseInt(flowEdge.target, 10),
    layout: {
      sourceHandle:
        flowEdge.sourceHandle as EdgeEntity['layout']['sourceHandle'],
      targetHandle:
        flowEdge.targetHandle as EdgeEntity['layout']['targetHandle'],
    },
    data: flowEdge.data,
    dataType: flowEdge.type as EdgeEntity['dataType'],
  };
}

export function convertFlowFullToFlowModel(flowFull: FlowFull): FlowModel {
  return {
    nodes: flowFull.nodes.map(convertNodeEntityToFlowNode),
    edges: flowFull.edges.map(convertEdgeEntityToFlowEdge),
  };
}
