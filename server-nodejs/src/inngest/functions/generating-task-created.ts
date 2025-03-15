import { Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import { GeneratingTaskStatus } from '../../generating-task/generating-task.entity';
import { GeneratingTaskService } from '../../generating-task/generating-task.service';
import { randomUUID } from 'crypto';

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
}

const createGeneratingTaskCreatedFunction = (
  inngest: Inngest,
  dependencies: GeneratingTaskCreatedFunctionDependencies,
) => {
  const { logger, generatingTaskService } = dependencies;
  return inngest.createFunction(
    { id: GENERATING_TASK_CREATED_ID as string },
    { event: GENERATING_TASK_CREATED_EVENT_NAME as string },
    async (props) => {
      const { step } = props;
      const event = props.event as GeneratingTaskCreatedEvent;

      const generatingOrFailed = await step.run(
        `empty prompt to failed`,
        async () => {
          logger.log(
            `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Pending`,
          );
          const record = await generatingTaskService.getGeneratingTask(
            event.data.generatingTaskId,
          );
          const status = record.input.prompt
            ? GeneratingTaskStatus.Generating
            : GeneratingTaskStatus.Failed;
          await generatingTaskService.patchGeneratingTask(
            event.data.generatingTaskId,
            {
              status,
              output: {
                generatedContent: '',
              },
            },
          );
          return status;
        },
      );

      if (generatingOrFailed === GeneratingTaskStatus.Failed) return;

      await step.run(`generating`, async () => {
        logger.log(
          `[GeneratingTaskCreatedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Generating`,
        );
        let mockGenerateContent = '';
        try {
          for (let mockLoop = 0; mockLoop < 5; mockLoop++) {
            mockGenerateContent += new Array(10)
              .fill(null)
              .map(() => randomUUID())
              .join(', ');
            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Generating,
                output: {
                  generatedContent: mockGenerateContent,
                },
              },
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }

          return await generatingTaskService.patchGeneratingTask(
            event.data.generatingTaskId,
            {
              status: GeneratingTaskStatus.Done,
              output: {
                generatedContent: mockGenerateContent,
              },
            },
          );
        } catch (error) {
          return await generatingTaskService.patchGeneratingTask(
            event.data.generatingTaskId,
            {
              status: GeneratingTaskStatus.Failed,
              output: {
                generatedContent: mockGenerateContent,
              },
            },
          );
        }
      });
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
