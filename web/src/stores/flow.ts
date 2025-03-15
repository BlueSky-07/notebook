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
import { FlowEntity, NodeEntity } from '@api/models'

export interface FlowState extends FlowModel {
  // Rxjs Subject
  subject?: FlowSubject

  // Life Cycles
  bootstrap: (flowId: FlowEntity['id']) => void

  // Flow Internal Callbacks
  onNodesChange: OnNodesChange<Node>
  onEdgesChange: OnEdgesChange<Edge>
  onConnect: OnConnect
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void

  // User Actions Callbacks
  addNode: (type: NodeEntity['dataType']) => void
  updateNodeData: (id: string, data: Node['data']) => void
  updateEdgeData: (id: string, data: Edge['data']) => void
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
      subject.loadFromAPI()
      // subject.loadFromLocalStorage()
    },
    nodes: [],
    edges: [],
    onNodesChange: (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case 'position': {
            get().subject?.updateNodePosition(change.id, change.position)
            break
          }
          case 'remove': {
            get().subject?.deleteNode(change.id)
            break
          }
          default: {
            const nextNodes = applyNodeChanges(changes, get().nodes)
            get().subject?.next({
              nodes: nextNodes,
            })
          }
        }
      }
    },
    onEdgesChange: (changes) => {
      for (const change of changes) {
        switch (change.type) {
          case 'remove': {
            get().subject?.deleteEdge(change.id)
            break
          }
          default: {
            const nextEdges = applyEdgeChanges(changes, get().edges)
            get().subject?.next({
              edges: nextEdges,
            })
          }
        }
      }
    },
    onConnect: (connection) => {
      get().subject?.addEdge(connection.source, connection.target, connection.sourceHandle, connection.targetHandle)
    },
    setNodes: (nodes) => {
      get().subject?.next({
        nodes,
      })
    },
    setEdges: (edges) => {
      get().subject?.next({
        edges,
      })
    },
    addNode: (dataType: NodeEntity['dataType']) => {
      get().subject?.addNode(dataType)
    },
    updateNodeData: (id: string, data: Node['data']) => {
      get().subject?.updateNodeData(id, data)
    },
    updateEdgeData: (id: string, data: Edge['data']) => {
      get().subject?.updateEdgeData(id, data)
    }
  }
})

export default useFlowStore