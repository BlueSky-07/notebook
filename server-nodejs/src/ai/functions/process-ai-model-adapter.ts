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
        if (!event.data.modelId) {
          throw ProcessAIModelAdapterErrors.ModelIdIsMissing;
        }
        const adapter = aiService.getAdapter(event.data.modelId);
        if (!adapter) {
          throw ProcessAIModelAdapterErrors.AdapterNotFound;
        }

        const adapterProcessResult = await step.run(
          'process ai model adapter',
          async () => {
            logger.log(
              `${PROCESS_AI_MODEL_ADAPTER} modelId: ${event.data.modelId}, generatingTaskId: ${event.data.generatingTaskId} Processing`,
            );
            try {
              return await adapter.processGenerating(
                event.data.generatingTaskId,
              );
            } catch (e) {
              logger.error(e);
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
              throw new NonRetriableError((e as Error).message);
            }
          },
        );

        if (adapterProcessResult) {
          if (adapterProcessResult.pollingTaskId) {
            const pollingResult = (await step.waitForEvent(
              `wait for adapter polling`,
              {
                event:
                  AiModelAdapterHandlerEvent.EVENT_NAMES
                    .AI_MODEL_ADAPTER_HANDLER_POLLING_COMPLETED,
                timeout:
                  adapter.pollingTaskWaitForTimeout || adapter.waitForTimeout,
                if: `async.data.generatingTaskId == event.data.generatingTaskId && async.data.modelId == "${event.data.modelId}" && async.data.pollingTaskId == "${adapterProcessResult.pollingTaskId}"`,
              },
            )) as AiModelAdapterHandlerEventSchemas[typeof AiModelAdapterHandlerEvent.EVENT_NAMES.AI_MODEL_ADAPTER_HANDLER_POLLING_COMPLETED];

            if (!pollingResult) {
              throw new NonRetriableError(
                `Polling timeout for modelId: ${event.data.modelId}, generatingTaskId: ${event.data.generatingTaskId}`,
              );
            }
            await step.run('ai model adapter done after polling', async () => {
              await AiModelAdapterHandlerEvent.trigger(
                inngest,
                AiModelAdapterHandlerEvent.EVENT_NAMES
                  .AI_MODEL_ADAPTER_HANDLER_COMPLETED,
                {
                  modelId: event.data.modelId,
                  generatingTaskId: event.data.generatingTaskId,
                  status: pollingResult.data.done
                    ? AiModelAdapterStatus.Done
                    : AiModelAdapterStatus.Failed,
                  errorMessage: pollingResult.data.errorMessage,
                  generatedFileId: pollingResult.data.generatedFileId,
                },
              );
            });
          } else {
            await step.run('ai model adapter done', async () => {
              await AiModelAdapterHandlerEvent.trigger(
                inngest,
                AiModelAdapterHandlerEvent.EVENT_NAMES
                  .AI_MODEL_ADAPTER_HANDLER_COMPLETED,
                {
                  modelId: event.data.modelId,
                  generatingTaskId: event.data.generatingTaskId,
                  generatedFileId: adapterProcessResult.fileId,
                  status:
                    adapterProcessResult.fileId == null
                      ? AiModelAdapterStatus.Failed
                      : AiModelAdapterStatus.Done,
                },
              );
            });
          }
        }
        return adapterProcessResult;
      }
    },
  );
};
