import { FlowEntity } from './flow.entity'

export type FlowAddInput = Omit<FlowEntity, 'id' | 'updatedAt'>
export type FlowAddResponse = Pick<FlowEntity, 'id'>
export type FlowPatchInput = Partial<Omit<FlowEntity, 'id' | 'updatedAt'>>
export type FlowDeleteResponse = { done: boolean }
