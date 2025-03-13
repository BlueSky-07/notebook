import { Configuration } from  '@api/configuration'
import { DocumentApi, FlowApi, NodeApi, EdgeApi } from '@api/api'

export const API_CONFIGURATION: Configuration = {
  basePath: '/api'
} as Configuration

const apiClients = {
  document: new DocumentApi(API_CONFIGURATION),
  flow: new FlowApi(API_CONFIGURATION),
  node: new NodeApi(API_CONFIGURATION),
  edge: new EdgeApi(API_CONFIGURATION),
}

export default apiClients;