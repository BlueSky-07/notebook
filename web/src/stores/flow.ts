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
import { FlowEntity, NodeEntity } from '@api/models';
import { NodeApi } from '@api/clients/node-api';
import { EdgeApi } from '@api/clients/edge-api';

export interface FlowState extends FlowModel {
  // Rxjs Subject
  subject?: FlowSubject;

  // Life Cycles
  bootstrap: (flowId: FlowEntity['id']) => void;
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
  ) => void;
  updateNodeData: (
    id: string,
    data: Node['data'],
  ) => ReturnType<NodeApi['patchNode']>;
  updateEdgeData: (
    id: string,
    data: Edge['data'],
  ) => ReturnType<EdgeApi['patchEdge']>;

  // Other States
  modelId?: string;

  // Other User Actions Callbacks
  updateModelId: (modelId: string) => void;
}

const useFlowStore = create<FlowState>((set, get) => {
  return {
    subject: undefined,
    nodes: [],
    edges: [],
    bootstrap: (flowId: FlowEntity['id']) => {
      const lastSubject = get().subject;
      if (lastSubject) {
        lastSubject.complete();
      }
      const subject = new FlowSubject(flowId);
      subject.subscribe((data) => {
        return set({ ...data });
      });
      set({ subject });
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
      get().subject?.addEdge(
        connection.source,
        connection.target,
        connection.sourceHandle,
        connection.targetHandle,
      );
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
      get().subject?.addNode(dataType, copyFrom, center);
    },
    updateNodeData: async (id: string, data: Node['data']) => {
      return get().subject?.updateNodeData(id, data);
    },
    updateEdgeData: async (id: string, data: Edge['data']) => {
      return get().subject?.updateEdgeData(id, data);
    },
    modelId: localStorage.getItem('model-id'),
    updateModelId: (modelId: string) => {
      set({ modelId });
      localStorage.setItem('model-id', modelId);
    },
  };
});

export default useFlowStore;
