import {
  StandardEventSchemas,
  StandardEventSchema,
} from 'inngest/components/EventSchemas';
import {
  FlowUpdatedEvent,
  FLOW_UPDATED_EVENT_NAME,
} from './functions/flow-updated';

export interface InngestEvents extends StandardEventSchemas {
  [FLOW_UPDATED_EVENT_NAME]: FlowUpdatedEvent;
  [key: string]: StandardEventSchema;
}

export default InngestEvents;
