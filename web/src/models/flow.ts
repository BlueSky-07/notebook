import { type Edge, type Node } from '@xyflow/react'

export interface FlowModel {
  nodes: Node[]
  edges: Edge[]
}

export const DEFAULT_FLOW_MODEL: FlowModel = {
  nodes: [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ],
  edges: [{ id: 'e1-2', source: '1', target: '2' }],
}