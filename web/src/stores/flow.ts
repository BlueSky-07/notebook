import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
} from '@xyflow/react';
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import FlowSubject from '@/rxjs/subjects/flow';
import { FlowModel } from '@/models/flow';
import { AiModelInfo, FlowEntity, NodeEntity } from '@api/models';
import { NodeApi } from '@api/clients/node-api';
import { EdgeApi } from '@api/clients/edge-api';
import { RefObject } from 'react';
import { ReactFlowRef } from 'src/pages/flow/components/react-flow-ref-forwarder';

export interface FlowState extends FlowModel {
  // Rxjs Subject
  subject?: FlowSubject;

  // Life Cycles
  reactFlowRef: RefObject<ReactFlowRef>;
  bootstrap: (
    flowId: FlowEntity['id'],
    reactFlowRef: RefObject<ReactFlowRef>,
  ) => void;
  getFlowId: () => FlowEntity['id'];
  getNode: (nodeId: string) => Node | undefined;

  // Flow Internal Callbacks
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  // Flow User Actions Callbacks
  addNode: (
    type: NodeEntity['dataType'],
    copyFrom?: Node,
    center?: XYPosition,
  ) => Promise<Node>;
  deleteNode: (id: Node['id']) => ReturnType<NodeApi['deleteNode']>;
  deleteEdge: (id: Edge['id']) => ReturnType<EdgeApi['deleteEdge']>;
  updateNodeData: (
    id: Node['id'],
    data: Node['data'],
  ) => ReturnType<NodeApi['patchNode']>;
  updateEdgeData: (
    id: Node['id'],
    data: Edge['data'],
  ) => ReturnType<EdgeApi['patchEdge']>;

  // Other States
  selectedNodeIds: Node['id'][];
  modelId?: AiModelInfo['id'];

  // Other User Actions Callbacks
  updateModelId: (modelId: AiModelInfo['id']) => void;
}

const useFlowStore = create<FlowState>((set, get) => {
  return {
    subject: undefined,
    nodes: [],
    edges: [],
    reactFlowRef: null,
    bootstrap: (
      flowId: FlowEntity['id'],
      reactFlowRef: RefObject<ReactFlowRef>,
    ) => {
      const lastSubject = get().subject;
      if (lastSubject) {
        lastSubject.complete();
      }
      const subject = new FlowSubject(flowId);
      subject.subscribe((data) => {
        return set({ ...data });
      });
      set({ subject, selectedNodeIds: [], reactFlowRef });
      subject.loadFromAPI();
      // subject.loadFromLocalStorage()
    },
    getFlowId: () => {
      return get().subject?.getFlowId();
    },
    getNode: (nodeId: string) => {
      return get().nodes.find((node) => node.id === nodeId);
    },
    onNodesChange: (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case 'position': {
            get().subject?.updateNodePosition(change.id, change);
            break;
          }
          case 'dimensions': {
            get().subject?.updateNodeDimension(change.id, change);
            break;
          }
          case 'remove': {
            get().subject?.deleteNode(change.id);
            break;
          }
          case 'select': {
            const selectedNodeIds = get().selectedNodeIds;
            if (
              selectedNodeIds.includes(change.id) &&
              change.selected === false
            ) {
              set({
                selectedNodeIds: selectedNodeIds.filter(
                  (id) => id !== change.id,
                ),
              });
            } else if (
              !selectedNodeIds.includes(change.id) &&
              change.selected === true
            ) {
              set({ selectedNodeIds: selectedNodeIds.concat(change.id) });
            }
          }
          // fall through for ui update
          default: {
            const nextNodes = applyNodeChanges(changes, get().nodes);
            get().subject?.next({
              nodes: nextNodes,
            });
          }
        }
      }
    },
    onEdgesChange: (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case 'remove': {
            get().subject?.deleteEdge(change.id);
            break;
          }
          default: {
            const nextEdges = applyEdgeChanges(changes, get().edges);
            get().subject?.next({
              edges: nextEdges,
            });
          }
        }
      }
    },
    onConnect: (connection) => {
      const selectedNodeIds = get().selectedNodeIds;
      if (selectedNodeIds.includes(connection.source)) {
        for (const source of selectedNodeIds) {
          get().subject?.addEdge(
            source,
            connection.target,
            connection.sourceHandle,
            connection.targetHandle,
          );
        }
      } else {
        get().subject?.addEdge(
          connection.source,
          connection.target,
          connection.sourceHandle,
          connection.targetHandle,
        );
      }
    },
    setNodes: (nodes) => {
      get().subject?.next({
        nodes,
      });
    },
    setEdges: (edges) => {
      get().subject?.next({
        edges,
      });
    },
    addNode: (
      dataType: NodeEntity['dataType'],
      copyFrom?: Node,
      center?: XYPosition,
    ) => {
      return get().subject?.addNode(dataType, copyFrom, center);
    },
    deleteNode: async (id: Node['id']) => {
      return get().subject?.deleteNode(id);
    },
    deleteEdge: async (id: Edge['id']) => {
      return get().subject?.deleteEdge(id);
    },
    updateNodeData: async (id: Node['id'], data: Node['data']) => {
      return get().subject?.updateNodeData(id, data);
    },
    updateEdgeData: async (id: Node['id'], data: Edge['data']) => {
      return get().subject?.updateEdgeData(id, data);
    },
    selectedNodeIds: [],
    modelId: localStorage.getItem('model-id'),
    updateModelId: (modelId: AiModelInfo['id']) => {
      set({ modelId });
      localStorage.setItem('model-id', modelId);
    },
  };
});

export default useFlowStore;
