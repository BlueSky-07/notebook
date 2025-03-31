import { Logger } from '@nestjs/common';
import { Inngest, NonRetriableError } from 'inngest';
import { GeneratingTaskStatus } from '../generating-task.entity';
import { GeneratingTaskService } from '../generating-task.service';
import { AiService } from '../../ai/ai.service';
import { generateText } from 'ai';
import { pick } from 'lodash';
import GeneratingTaskEvent, {
  GeneratingTaskEventSchemas,
} from '../generating-task.event';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { matchEventNames } from '../../inngest/helper';
import { NodeDataType } from '../../node/node.entity';

export interface GenerateTextNodeContentFunctionDependencies {
  logger: Logger;
  generatingTaskService: GeneratingTaskService;
  aiService: AiService;
}

const GenerateTextNodeContentErrors = {
  EmptyPrompt: new NonRetriableError('Empty Prompt'),
  NotGenerating: new NonRetriableError(
    'Generating Task status is not generating',
  ),
  EmptyGenerated: new NonRetriableError('Empty Generated'),
  ModelNotFound: new NonRetriableError('Model not found'),
};

const GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID = 'job/generate-text-node-content';

export const createGenerateTextNodeContentFunction = (
  inngest: Inngest,
  dependencies: GenerateTextNodeContentFunctionDependencies,
) => {
  const { logger, generatingTaskService, aiService } = dependencies;
  return inngest.createFunction(
    {
      id: GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID,
      retries: 0,
      cancelOn: [
        {
          event: GeneratingTaskEvent.EVENT_NAMES
            .GENERATING_TASK_STATUS_UPDATED as string,
          if: `async.data.generatingTaskId == event.data.generatingTaskId && async.data.generatingTaskStatus == "${GeneratingTaskStatus.Stopped}"`,
        },
      ],
    },
    {
      event: GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_CREATED,
      if: `event.data.targetNodeDataType == "${NodeDataType.Text}"`,
    },
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;

      if (
        !matchEventNames<
          GeneratingTaskEventSchemas[typeof GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_CREATED]
        >(event, [GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_CREATED])
      ) {
        return;
      }

      await step.run(`check input.prompt`, async () => {
        logger.log(
          `${GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Pending`,
        );
        const record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (record.input.prompt) return 'prompt is not empty, continue';
        await generatingTaskService.patchGeneratingTask(
          event.data.generatingTaskId,
          {
            status: GeneratingTaskStatus.Failed,
            output: {
              generatedContent: '',
              errorMessage: GenerateTextNodeContentErrors.EmptyPrompt.message,
            },
          },
        );
        throw GenerateTextNodeContentErrors.EmptyPrompt;
      });

      await step.run(`set status to generating`, async () => {
        logger.log(
          `${GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Generating`,
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
          throw GenerateTextNodeContentErrors.NotGenerating;
        const model = aiService.getModel(record.input.modelId);
        if (!model) throw GenerateTextNodeContentErrors.ModelNotFound;
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
          throw GenerateTextNodeContentErrors.NotGenerating;

        if (generatedText.text) {
          await step.run(`generated done`, async () => {
            logger.log(
              `${GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Done`,
            );
            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Done,
                output: {
                  generatedContent: generatedText.text,
                  generatedReasoning: generatedText.reasoning,
                },
              },
            );
            return stepResult;
          });
        } else {
          await step.run(`generated empty`, async () => {
            logger.log(
              `${GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
            );

            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Failed,
                output: {
                  generatedContent: generatedText.finishReason,
                  errorMessage:
                    GenerateTextNodeContentErrors.EmptyGenerated.message,
                },
              },
            );
            return stepResult;
          });
        }
      } catch (error) {
        if (error === GenerateTextNodeContentErrors.NotGenerating) return;
        await step.run(`generated failed`, async () => {
          logger.log(
            `${GENERATE_TEXT_NODE_CONTENT_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
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
