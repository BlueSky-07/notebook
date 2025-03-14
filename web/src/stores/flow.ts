import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react'
import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import FlowSubject from '@/rxjs/subjects/flow'
import { FlowModel, getFlowNode } from '@/models/flow'
import { FlowEntity, NodeEntity } from '@api/models'

export interface FlowState extends FlowModel {
  // Rxjs Subject
  subject?: FlowSubject

  // Life Cycles
  bootstrap: (flowId: FlowEntity['id']) => void

  // Flow Internal Callbacks
  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void

  // User Actions Callbacks
  addNode: (type: NodeEntity['dataType']) => void
  updateNode: (id: string, data: Node['data']) => void
}

const useFlowStore = create<FlowState>((set, get) => {
  return {
    subject: undefined,
    bootstrap: (flowId: FlowEntity['id']) => {
      const lastSubject = get().subject
      if (lastSubject) {
        lastSubject.complete()
      }
      const subject = new FlowSubject(flowId)
      subject.subscribe(data => set({ ...data }))
      set({ subject })
      // subject.loadFromAPI()
      subject.loadFromLocalStorage()
    },
    nodes: [],
    edges: [],
    onNodesChange: (changes) => {
      const nextNodes = applyNodeChanges(changes, get().nodes)
      get().subject?.next({
        nodes: nextNodes,
        edges: get().edges,
      })
    },
    onEdgesChange: (changes) => {
      const nextEdges = applyEdgeChanges(changes, get().edges)
      get().subject?.next({
        nodes: get().nodes,
        edges: nextEdges,
      })
    },
    onConnect: (connection) => {
      const nextEdges = addEdge(connection, get().edges)
      get().subject?.next({
        nodes: get().nodes,
        edges: nextEdges,
      })
    },
    setNodes: (nodes) => {
      get().subject?.next({
        nodes,
        edges: get().edges,
      })
    },
    setEdges: (edges) => {
      get().subject?.next({
        nodes: get().nodes,
        edges,
      })
    },
    addNode: (dataType: NodeEntity['dataType']) => {
      const newNodeId = Date.now()
      get().subject?.next({
        nodes: [...get().nodes, getFlowNode(newNodeId, dataType)],
        edges: get().edges,
      })
    },
    updateNode: (id: string, data: NodeEntity['data']) => {
      const nodes = get().nodes
      const nodeIndex = nodes.findIndex(node => node.id === id)
      if (nodeIndex !== -1) {
        nodes[nodeIndex] = {
          ...nodes[nodeIndex],
          data: data as Node['data'],
        }
      }
      get().subject?.next({
        nodes: [...nodes],
        edges: get().edges,
      })
    }
  }
})

export default useFlowStore