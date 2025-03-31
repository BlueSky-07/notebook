import {
  createInngestEventTrigger,
  createInngestEventTriggers,
} from '../inngest/helper';
import { StandardEventSchemas } from 'inngest/components/EventSchemas';
import { FlowEntity } from '../flow/flow.entity';
import { NodeEntity } from './node.entity';

export enum EVENT_NAMES {
  NODE_CREATED = 'node.created',
  NODE_UPDATED = 'node.updated',
  NODE_DELETED = 'node.deleted',
}

export interface NodeEventSchemas extends StandardEventSchemas {
  [EVENT_NAMES.NODE_CREATED]: {
    data: {
      nodeId: NodeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
  [EVENT_NAMES.NODE_UPDATED]: {
    data: {
      nodeId: NodeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
  [EVENT_NAMES.NODE_DELETED]: {
    data: {
      nodeId: NodeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
}

export const NodeEvent = {
  EVENT_NAMES,
  triggers: createInngestEventTriggers<NodeEventSchemas>(
    Object.values(EVENT_NAMES),
  ),
  trigger: createInngestEventTrigger<NodeEventSchemas>(),
};

export default NodeEvent;
