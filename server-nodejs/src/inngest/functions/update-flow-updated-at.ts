import { Logger } from '@nestjs/common';
import { FlowService } from '../../flow/flow.service';
import { Inngest } from 'inngest';
import NodeEvent, { NodeEventSchemas } from '../../node/node.event';
import { matchEventNames } from '../helper';
import { StandardEventSchema } from 'inngest/components/EventSchemas';

export interface FlowUpdatedFunctionDependencies {
  logger: Logger;
  flowService: FlowService;
}

export const createUpdateFlowUpdatedAtFunction = (
  inngest: Inngest,
  dependencies: FlowUpdatedFunctionDependencies,
) => {
  const { logger, flowService } = dependencies;
  return inngest.createFunction(
    {
      id: 'job/update-flow-updated-at',
      debounce: {
        period: '10s',
        key: 'event.data.flowId',
      },
    },
    [
      { event: NodeEvent.EVENT_NAMES.NODE_CREATED },
      { event: NodeEvent.EVENT_NAMES.NODE_UPDATED },
      { event: NodeEvent.EVENT_NAMES.NODE_DELETED },
    ],
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;
      if (
        matchEventNames<
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_CREATED]
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_UPDATED]
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_DELETED]
        >(event, [
          NodeEvent.EVENT_NAMES.NODE_CREATED,
          NodeEvent.EVENT_NAMES.NODE_UPDATED,
          NodeEvent.EVENT_NAMES.NODE_DELETED,
        ])
      ) {
        if (event.data.flowId) {
          await step.run(
            `update flow updatedAt field after node changed`,
            async () => {
              logger.log(`[FlowUpdatedFunction] flowId: ${event.data.flowId}`);
              return await flowService.patchFlow(event.data.flowId, {});
            },
          );
        }
      }
    },
  );
};
