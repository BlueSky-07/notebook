import { Configuration } from '@api/configuration';
import {
  FlowApi,
  NodeApi,
  EdgeApi,
  GeneratingTaskApi,
  AiApi,
  StorageApi,
} from '@api/api';

export const API_CONFIGURATION: Configuration = {
  basePath: '/api',
} as Configuration;

const apiClients = {
  flow: new FlowApi(API_CONFIGURATION),
  node: new NodeApi(API_CONFIGURATION),
  edge: new EdgeApi(API_CONFIGURATION),
  generatingTask: new GeneratingTaskApi(API_CONFIGURATION),
  ai: new AiApi(API_CONFIGURATION),
  storage: new StorageApi(API_CONFIGURATION),
};

export default apiClients;
