import { NodeEntity } from './node.entity'

export type NodeAddInput =
  Pick<NodeEntity, 'flowId'>
  & Partial<Pick<NodeEntity, 'positionX' | 'positionY' | 'data' | 'dataType'>>
export type NodeAddResponse = Pick<NodeEntity, 'id'>
export type NodePatchInput = Partial<Pick<NodeEntity, 'positionX' | 'positionY' | 'data' | 'dataType'>>
export type NodeDeleteResponse = { done: boolean }

export enum NodeDataType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}