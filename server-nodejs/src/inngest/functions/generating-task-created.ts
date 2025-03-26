import { Logger } from '@nestjs/common';
import { Inngest, NonRetriableError } from 'inngest';
import { GeneratingTaskStatus } from '../../generating-task/generating-task.entity';
import { GeneratingTaskService } from '../../generating-task/generating-task.service';
import { AiService } from '../../ai/ai.service';
import { generateText } from 'ai';
import { pick } from 'lodash';
import { GENERATING_TASK_STATUS_CHANGED_EVENT_NAME } from './generating-task-status-changed';

export type GeneratingTaskCreatedEvent = {
  data: {
    generatingTaskId: number;
    targetNodeId: number;
  };
};

export const GENERATING_TASK_CREATED_ID = 'generating-task.created';
export const GENERATING_TASK_CREATED_EVENT_NAME = `job/${GENERATING_TASK_CREATED_ID}`;

export interface GeneratingTaskCreatedFunctionDependencies {
  logger: Logger;
  generatingTaskService: GeneratingTaskService;
  aiService: AiService;
}

export const GeneratingTaskCreatedErrors = {
  EmptyPrompt: new NonRetriableError('Empty Prompt'),
  NotGenerating: new NonRetriableError(
    'Generating Task status is not generating',
  ),
  EmptyGenerated: new NonRetriableError('Empty Generated'),
  ModelNotFound: new NonRetriableError('Model not found'),
};

const createGeneratingTaskCreatedFunction = (
  inngest: Inngest,
  dependencies: GeneratingTaskCreatedFunctionDependencies,
) => {
  const { logger, generatingTaskService, aiService } = dependencies;
  return inngest.createFunction(
    {
      id: GENERATING_TASK_CREATED_ID as string,
      retries: 0,
      cancelOn: [
        {
          event: GENERATING_TASK_STATUS_CHANGED_EVENT_NAME as string,
          if: `async.data.generatingTaskId == event.data.generatingTaskId && async.data.generatingTaskStatus == "${GeneratingTaskStatus.Stopped}"`,
        },
      ],
    },
    { event: GENERATING_TASK_CREATED_EVENT_NAME as string },
    async (props) => {
      const { step } = props;
      const event = props.event as GeneratingTaskCreatedEvent;

      await step.run(`empty prompt to failed`, async () => {
        logger.log(
          `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Pending`,
        );
        const record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (record.input.prompt) return 'continue';
        await generatingTaskService.patchGeneratingTask(
          event.data.generatingTaskId,
          {
            status: GeneratingTaskStatus.Failed,
            output: {
              generatedContent: '',
              errorMessage: GeneratingTaskCreatedErrors.EmptyPrompt.message,
            },
          },
        );
        throw GeneratingTaskCreatedErrors.EmptyPrompt;
      });

      await step.run(`set status to generating`, async () => {
        logger.log(
          `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Generating`,
        );
        await generatingTaskService.patchGeneratingTask(
          event.data.generatingTaskId,
          {
            status: GeneratingTaskStatus.Generating,
            output: {
              generatedContent: '',
            },
          },
        );
        return 'done';
      });

      try {
        let record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (record.status !== GeneratingTaskStatus.Generating)
          throw GeneratingTaskCreatedErrors.NotGenerating;
        const model = aiService.getModel(record.input.modelId);
        if (!model) throw GeneratingTaskCreatedErrors.ModelNotFound;
        const generatedText = await step.ai.wrap('generating', generateText, {
          model,
          prompt: record.input.prompt,
        });
        const stepResult = pick(generatedText, [
          'text',
          'reasoning',
          'sources',
          'finishReason',
          'usage',
        ]);

        record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (record.status !== GeneratingTaskStatus.Generating)
          throw GeneratingTaskCreatedErrors.NotGenerating;

        if (generatedText.text) {
          await step.run(`generated done`, async () => {
            logger.log(
              `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Done`,
            );
            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Done,
                output: {
                  generatedContent: generatedText.text,
                },
              },
            );
            return stepResult;
          });
        } else {
          await step.run(`generated empty`, async () => {
            logger.log(
              `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
            );

            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Failed,
                output: {
                  generatedContent: generatedText.finishReason,
                  errorMessage:
                    GeneratingTaskCreatedErrors.EmptyGenerated.message,
                },
              },
            );
            return stepResult;
          });
        }
      } catch (error) {
        if (error === GeneratingTaskCreatedErrors.NotGenerating) return;
        await step.run(`generated failed`, async () => {
          logger.log(
            `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
          );

          await generatingTaskService.patchGeneratingTask(
            event.data.generatingTaskId,
            {
              status: GeneratingTaskStatus.Failed,
              output: {
                errorMessage: String((error as Error).message),
              },
            },
          );
        });
      }
    },
  );
};

const triggerGeneratingTaskCreatedFunction = (
  inngest: Inngest,
  eventData: GeneratingTaskCreatedEvent['data'],
) => {
  return inngest.send({
    name: GENERATING_TASK_CREATED_EVENT_NAME,
    data: eventData,
  });
};

export default {
  create: createGeneratingTaskCreatedFunction,
  trigger: triggerGeneratingTaskCreatedFunction,
};
