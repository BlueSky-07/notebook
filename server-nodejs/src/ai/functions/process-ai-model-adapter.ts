import { Logger } from '@nestjs/common';
import { Inngest, NonRetriableError } from 'inngest';
import { AiService } from '../ai.service';
import AiModelAdapterHandlerEvent, {
  AiModelAdapterHandlerEventSchemas,
} from '../adapter.event';
import { matchEventNames } from '../../inngest/helper';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { AiModelAdapterStatus } from '../adapter.type';

export interface ProcessAIModelAdapterDependencies {
  logger: Logger;
  aiService: AiService;
}
const ProcessAIModelAdapterErrors = {
  ModelIdIsMissing: new NonRetriableError('Model id is missing'),
  AdapterNotFound: new NonRetriableError('Adapter not found'),
};

const PROCESS_AI_MODEL_ADAPTER = 'job/process-ai-model-adapter';

export const createProcessAIModelAdapterFunction = (
  inngest: Inngest,
  dependencies: ProcessAIModelAdapterDependencies,
) => {
  const { logger, aiService } = dependencies;
  return inngest.createFunction(
    { id: PROCESS_AI_MODEL_ADAPTER, retries: 0 },
    [
      {
        event:
          AiModelAdapterHandlerEvent.EVENT_NAMES
            .AI_MODEL_ADAPTER_HANDLER_CREATED,
      },
    ],
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;
      if (
        matchEventNames<
          AiModelAdapterHandlerEventSchemas[typeof AiModelAdapterHandlerEvent.EVENT_NAMES.AI_MODEL_ADAPTER_HANDLER_CREATED]
        >(event, [
          AiModelAdapterHandlerEvent.EVENT_NAMES
            .AI_MODEL_ADAPTER_HANDLER_CREATED,
        ])
      ) {
        await step.run('process ai model adapter', async () => {
          logger.log(
            `${PROCESS_AI_MODEL_ADAPTER} modelId: ${event.data.modelId}, generatingTaskId: ${event.data.generatingTaskId} Processing`,
          );
          try {
            if (!event.data.modelId) {
              throw ProcessAIModelAdapterErrors.ModelIdIsMissing;
            }
            const adapter = aiService.getAdapter(event.data.modelId);
            if (!adapter) {
              throw ProcessAIModelAdapterErrors.AdapterNotFound;
            }

            const adapterProcessResult = await adapter.processGenerating(
              event.data.generatingTaskId,
            );
            await AiModelAdapterHandlerEvent.trigger(
              inngest,
              AiModelAdapterHandlerEvent.EVENT_NAMES
                .AI_MODEL_ADAPTER_HANDLER_COMPLETED,
              {
                modelId: event.data.modelId,
                generatingTaskId: event.data.generatingTaskId,
                generatedFileId: adapterProcessResult.fileId,
                status: AiModelAdapterStatus.Done,
              },
            );
            return adapterProcessResult;
          } catch (e) {
            await AiModelAdapterHandlerEvent.trigger(
              inngest,
              AiModelAdapterHandlerEvent.EVENT_NAMES
                .AI_MODEL_ADAPTER_HANDLER_COMPLETED,
              {
                modelId: event.data.modelId,
                generatingTaskId: event.data.generatingTaskId,
                status: AiModelAdapterStatus.Failed,
                errorMessage: (e as Error).message,
              },
            );
          }
        });
      }
    },
  );
};
