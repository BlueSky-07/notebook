import { StandardEventSchemas } from 'inngest/components/EventSchemas';
import { GeneratingTaskEntity } from '../generating-task/generating-task.entity';
import { AiModelAdapterStatus } from './adapter.type';
import {
  createInngestEventTrigger,
  createInngestEventTriggers,
} from '../inngest/helper';
import { FileEntity } from '../file/file.entity';

export enum EVENT_NAMES {
  AI_MODEL_ADAPTER_HANDLER_CREATED = 'ai-model-adapter-handler.created',
  AI_MODEL_ADAPTER_HANDLER_COMPLETED = 'ai-model-adapter-handler.completed',
}

export interface AiModelAdapterHandlerEventSchemas
  extends StandardEventSchemas {
  [EVENT_NAMES.AI_MODEL_ADAPTER_HANDLER_CREATED]: {
    data: {
      modelId: GeneratingTaskEntity['input']['modelId'];
      generatingTaskId: GeneratingTaskEntity['id'];
    };
  };
  [EVENT_NAMES.AI_MODEL_ADAPTER_HANDLER_COMPLETED]: {
    data: {
      modelId: GeneratingTaskEntity['input']['modelId'];
      generatingTaskId: GeneratingTaskEntity['id'];
      generatedFileId?: FileEntity['id'];
      status: AiModelAdapterStatus;
      errorMessage?: string;
    };
  };
}

export const AiModelAdapterHandlerEvent = {
  EVENT_NAMES,
  triggers: createInngestEventTriggers<AiModelAdapterHandlerEventSchemas>(
    Object.values(EVENT_NAMES),
  ),
  trigger: createInngestEventTrigger<AiModelAdapterHandlerEventSchemas>(),
};

export default AiModelAdapterHandlerEvent;
