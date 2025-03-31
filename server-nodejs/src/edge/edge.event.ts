import {
  createInngestEventTrigger,
  createInngestEventTriggers,
} from '../inngest/helper';
import { StandardEventSchemas } from 'inngest/components/EventSchemas';
import { FlowEntity } from '../flow/flow.entity';
import { EdgeEntity } from './edge.entity';

export enum EVENT_NAMES {
  EDGE_CREATED = 'edge.created',
  EDGE_UPDATED = 'edge.updated',
  EDGE_DELETED = 'edge.deleted',
}

export interface EdgeEventSchemas extends StandardEventSchemas {
  [EVENT_NAMES.EDGE_CREATED]: {
    data: {
      edgeId: EdgeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
  [EVENT_NAMES.EDGE_UPDATED]: {
    data: {
      edgeId: EdgeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
  [EVENT_NAMES.EDGE_DELETED]: {
    data: {
      edgeId: EdgeEntity['id'];
      flowId: FlowEntity['id'];
    };
  };
}

export const EdgeEvent = {
  EVENT_NAMES,
  triggers: createInngestEventTriggers<EdgeEventSchemas>(
    Object.values(EVENT_NAMES),
  ),
  trigger: createInngestEventTrigger<EdgeEventSchemas>(),
};

export default EdgeEvent;
