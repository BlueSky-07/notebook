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
import { FlowModel } from '@/models/flow'

export interface FlowState extends FlowModel {
  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
}

const useFlowStore = create<FlowState>((set, get) => {
  const subject = new FlowSubject()
  setTimeout(() => {
    subject.subscribe(data => {
      set({ ...data })
    })
  })
  return {
    nodes: [],
    edges: [],
    onNodesChange: (changes) => {
      const nextNodes = applyNodeChanges(changes, get().nodes)
      subject.next({
        nodes: nextNodes,
        edges: get().edges,
      })
    },
    onEdgesChange: (changes) => {
      const nextEdges = applyEdgeChanges(changes, get().edges)
      subject.next({
        nodes: get().nodes,
        edges: nextEdges,
      })
    },
    onConnect: (connection) => {
      const nextEdges = addEdge(connection, get().edges)
      subject.next({
        nodes: get().nodes,
        edges: nextEdges,
      })
    },
    setNodes: (nodes) => {
      subject.next({
        nodes,
        edges: get().edges,
      })
    },
    setEdges: (edges) => {
      subject.next({
        nodes: get().nodes,
        edges,
      })
    },
  }
})

export default useFlowStore