import { Logger } from '@nestjs/common';
import { Inngest, NonRetriableError } from 'inngest';
import { AiService } from '../ai.service';
import AiModelAdapterHandlerEvent, {
  AiModelAdapterHandlerEventSchemas,
} from '../adapter.event';
import { matchEventNames } from '../../inngest/helper';
import { StandardEventSchema } from 'inngest/components/EventSchemas';

export interface ProcessAIModelAdapterPollingDependencies {
  logger: Logger;
  aiService: AiService;
}
const ProcessAIModelAdapterPollingErrors = {
  ModelIdIsMissing: new NonRetriableError('Model id is missing'),
  AdapterNotFound: new NonRetriableError('Adapter not found'),
};

const PROCESS_AI_MODEL_ADAPTER = 'job/process-ai-model-adapter-polling';

export const createProcessAIModelAdapterPollingFunction = (
  inngest: Inngest,
  dependencies: ProcessAIModelAdapterPollingDependencies,
) => {
  const { logger, aiService } = dependencies;
  return inngest.createFunction(
    {
      id: PROCESS_AI_MODEL_ADAPTER,
      retries: 0,
      debounce: {
        period: '3s',
        key: 'event.data.pollingTaskId',
      },
    },
    [
      {
        event:
          AiModelAdapterHandlerEvent.EVENT_NAMES
            .AI_MODEL_ADAPTER_HANDLER_POLLING_CREATED,
      },
    ],
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;
      if (
        matchEventNames<
          AiModelAdapterHandlerEventSchemas[typeof AiModelAdapterHandlerEvent.EVENT_NAMES.AI_MODEL_ADAPTER_HANDLER_POLLING_CREATED]
        >(event, [
          AiModelAdapterHandlerEvent.EVENT_NAMES
            .AI_MODEL_ADAPTER_HANDLER_POLLING_CREATED,
        ])
      ) {
        await step.run('ai model adapter polling', async () => {
          logger.log(
            `${PROCESS_AI_MODEL_ADAPTER} modelId: ${event.data.modelId}, generatingTaskId: ${event.data.generatingTaskId} Polling`,
          );
          try {
            if (!event.data.modelId) {
              throw ProcessAIModelAdapterPollingErrors.ModelIdIsMissing;
            }
            const adapter = aiService.getAdapter(event.data.modelId);
            if (!adapter) {
              throw ProcessAIModelAdapterPollingErrors.AdapterNotFound;
            }

            const adapterPollingResult = await adapter.pollingGeneratingTask(
              event.data.generatingTaskId,
              event.data.pollingTaskId,
            );
            if (adapterPollingResult.done || adapterPollingResult.failed) {
              await AiModelAdapterHandlerEvent.trigger(
                inngest,
                AiModelAdapterHandlerEvent.EVENT_NAMES
                  .AI_MODEL_ADAPTER_HANDLER_POLLING_COMPLETED,
                {
                  modelId: event.data.modelId,
                  generatingTaskId: event.data.generatingTaskId,
                  pollingTaskId: event.data.pollingTaskId,
                  pollingTaskStatus: adapterPollingResult.status,
                  done: adapterPollingResult.done,
                  generatedFileId: adapterPollingResult.fileId,
                  errorMessage: adapterPollingResult.errorMessage,
                },
              );
            }
            return adapterPollingResult;
          } catch (e) {
            await AiModelAdapterHandlerEvent.trigger(
              inngest,
              AiModelAdapterHandlerEvent.EVENT_NAMES
                .AI_MODEL_ADAPTER_HANDLER_POLLING_COMPLETED,
              {
                modelId: event.data.modelId,
                generatingTaskId: event.data.generatingTaskId,
                pollingTaskId: event.data.pollingTaskId,
                pollingTaskStatus: 'Error',
                done: false,
                errorMessage: (e as Error).message,
              },
            );
          }
        });
      }
    },
  );
};
