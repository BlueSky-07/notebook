import { Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import { NodeService } from '../../node/node.service';
import { GeneratingTaskStatus } from '../generating-task.entity';
import { GeneratingTaskService } from '../generating-task.service';
import GeneratingTaskEvent, {
  GeneratingTaskEventSchemas,
} from '../generating-task.event';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { matchEventNames } from '../../inngest/helper';

export interface UpdateNodeByGeneratingTaskFunctionDependencies {
  logger: Logger;
  nodeService: NodeService;
  generatingTaskService: GeneratingTaskService;
}

const UPDATE_NODE_BY_GENERATING_TASK_FUNCTION_ID =
  'job/update-node-by-generating-task';

export const createUpdateNodeByGeneratingTaskFunction = (
  inngest: Inngest,
  dependencies: UpdateNodeByGeneratingTaskFunctionDependencies,
) => {
  const { logger, nodeService, generatingTaskService } = dependencies;
  return inngest.createFunction(
    {
      id: UPDATE_NODE_BY_GENERATING_TASK_FUNCTION_ID,
      retries: 0,
    },
    { event: GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED },
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;

      if (
        !matchEventNames<
          GeneratingTaskEventSchemas[typeof GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED]
        >(event, [
          GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED,
        ])
      ) {
        return;
      }

      await step.run(`update target node state`, async () => {
        logger.log(
          `${UPDATE_NODE_BY_GENERATING_TASK_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId}, taskStatus: ${event.data.generatingTaskStatus}`,
        );
        if (event.data.generatingTaskStatus !== GeneratingTaskStatus.Done) {
          return await nodeService.patchNode(event.data.targetNodeId, {
            state: {
              generatingTaskId: event.data.generatingTaskId,
              generatingTaskStatus: event.data.generatingTaskStatus,
            },
          });
        }

        // write back generated content to data.content of target node
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
          state: {
            generatingTaskId: event.data.generatingTaskId,
            generatingTaskStatus: event.data.generatingTaskStatus,
          },
        });
      });
    },
  );
};
