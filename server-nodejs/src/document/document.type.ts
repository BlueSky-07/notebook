import { FlowEntity } from '../flow/flow.entity'
import { NodeEntity } from '../node/node.entity'
import { EdgeEntity } from '../edge/edge.entity'

export type DocumentFull = {
  flowId: FlowEntity['id'],
  name: FlowEntity['name'],
  author: FlowEntity['author'],
  updatedAt: FlowEntity['updatedAt'],
  nodes: NodeEntity[]
  edges: EdgeEntity[]
}

export type DocumentSlim = {
  flowId: FlowEntity['id'],
  name: FlowEntity['name'],
  author: FlowEntity['author'],
  updatedAt: FlowEntity['updatedAt'],
  nodeIds: NodeEntity['id'][]
  edgeIds: EdgeEntity['id'][]
}