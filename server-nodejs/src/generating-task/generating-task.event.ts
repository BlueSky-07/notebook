import {
  createInngestEventTrigger,
  createInngestEventTriggers,
} from '../inngest/helper';
import { StandardEventSchemas } from 'inngest/components/EventSchemas';
import { GeneratingTaskEntity } from './generating-task.entity';
import { NodeEntity } from '../node/node.entity';

export enum EVENT_NAMES {
  GENERATING_TASK_CREATED = 'generating-task.created',
  GENERATING_TASK_STATUS_UPDATED = 'generating-task.status.updated',
}

export interface GeneratingTaskEventSchemas extends StandardEventSchemas {
  [EVENT_NAMES.GENERATING_TASK_CREATED]: {
    data: {
      generatingTaskId: GeneratingTaskEntity['id'];
      targetNodeId: NodeEntity['id'];
      targetNodeDataType: NodeEntity['dataType'];
    };
  };
  [EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED]: {
    data: {
      generatingTaskId: GeneratingTaskEntity['id'];
      targetNodeId: NodeEntity['id'];
      generatingTaskStatus: GeneratingTaskEntity['status'];
    };
  };
}

export const GeneratingTaskEvent = {
  EVENT_NAMES,
  triggers: createInngestEventTriggers<GeneratingTaskEventSchemas>(
    Object.values(EVENT_NAMES),
  ),
  trigger: createInngestEventTrigger<GeneratingTaskEventSchemas>(),
};

export default GeneratingTaskEvent;
