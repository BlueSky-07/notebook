import { Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import { NodeService } from '../../node/node.service';
import { GeneratingTaskStatus } from '../../generating-task/generating-task.entity';
import { GeneratingTaskService } from '../../generating-task/generating-task.service';

export type GeneratingTaskStatusChangedEvent = {
  data: {
    generatingTaskId: number;
    targetNodeId: number;
    generatingTaskStatus: GeneratingTaskStatus;
  };
};

export const GENERATING_TASK_STATUS_CHANGED_ID =
  'generating-task.status-changed';
export const GENERATING_TASK_STATUS_CHANGED_EVENT_NAME = `job/${GENERATING_TASK_STATUS_CHANGED_ID}`;

export interface GeneratingTaskStatusChangedFunctionDependencies {
  logger: Logger;
  nodeService: NodeService;
  generatingTaskService: GeneratingTaskService;
}

const createGeneratingTaskStatusChangedFunction = (
  inngest: Inngest,
  dependencies: GeneratingTaskStatusChangedFunctionDependencies,
) => {
  const { logger, nodeService, generatingTaskService } = dependencies;
  return inngest.createFunction(
    { id: GENERATING_TASK_STATUS_CHANGED_ID as string },
    { event: GENERATING_TASK_STATUS_CHANGED_EVENT_NAME as string },
    async (props) => {
      const { step } = props;
      const event = props.event as GeneratingTaskStatusChangedEvent;
      await step.run(`update target node state`, async () => {
        logger.log(
          `[GeneratingTaskStatusChangedFunction] taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId}, taskStatus: ${event.data.generatingTaskStatus}`,
        );
        if (event.data.generatingTaskStatus !== GeneratingTaskStatus.Done) {
          return await nodeService.patchNode(event.data.targetNodeId, {
            state: {
              generatingTaskId: event.data.generatingTaskId,
              generatingTaskStatus: event.data.generatingTaskStatus,
            },
          });
        }

        const taskRecord = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        const nodeRecord = await nodeService.getNode(event.data.targetNodeId);
        return await nodeService.patchNode(event.data.targetNodeId, {
          data: {
            ...nodeRecord.data,
            content: [
              nodeRecord.data.content,
              taskRecord.output.generatedContent,
            ]
              .filter(Boolean)
              .join(''),
          },
          state: {},
        });
      });
    },
  );
};

const triggerGeneratingTaskStatusChangedFunction = (
  inngest: Inngest,
  eventData: GeneratingTaskStatusChangedEvent['data'],
) => {
  return inngest.send({
    name: GENERATING_TASK_STATUS_CHANGED_EVENT_NAME,
    data: eventData,
  });
};

export default {
  create: createGeneratingTaskStatusChangedFunction,
  trigger: triggerGeneratingTaskStatusChangedFunction,
};
