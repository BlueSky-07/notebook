import { EdgeEntity } from './edge.entity'

export type EdgeAddInput =
  Pick<EdgeEntity, 'flowId'>
  & Partial<Pick<EdgeEntity, 'sourceNodeId' | 'targetNodeId' | 'label'>>
export type EdgeAddResponse = Pick<EdgeEntity, 'id'>
export type EdgePatchInput = Partial<Pick<EdgeEntity, 'sourceNodeId' | 'targetNodeId' | 'label'>>
export type EdgeDeleteResponse = { done: boolean }
