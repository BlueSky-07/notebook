import { Logger } from '@nestjs/common';
import { FlowService } from '../flow.service';
import { Inngest } from 'inngest';
import NodeEvent, { NodeEventSchemas } from '../../node/node.event';
import EdgeEvent, { EdgeEventSchemas } from '../../edge/edge.event';
import { matchEventNames } from '../../inngest/helper';
import { StandardEventSchema } from 'inngest/components/EventSchemas';

export interface FlowUpdatedFunctionDependencies {
  logger: Logger;
  flowService: FlowService;
}

const UPDATE_FLOW_UPDATED_AT_FUNCTION_ID = 'job/update-flow-updated-at';

export const createUpdateFlowUpdatedAtFunction = (
  inngest: Inngest,
  dependencies: FlowUpdatedFunctionDependencies,
) => {
  const { logger, flowService } = dependencies;
  return inngest.createFunction(
    {
      id: UPDATE_FLOW_UPDATED_AT_FUNCTION_ID,
      debounce: {
        period: '10s',
        key: 'event.data.flowId',
      },
    },
    [
      { event: NodeEvent.EVENT_NAMES.NODE_CREATED },
      { event: NodeEvent.EVENT_NAMES.NODE_UPDATED },
      { event: NodeEvent.EVENT_NAMES.NODE_DELETED },
      { event: EdgeEvent.EVENT_NAMES.EDGE_CREATED },
      { event: EdgeEvent.EVENT_NAMES.EDGE_UPDATED },
      { event: EdgeEvent.EVENT_NAMES.EDGE_DELETED },
    ],
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;
      if (
        matchEventNames<
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_CREATED]
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_UPDATED]
          | NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_DELETED]
          | EdgeEventSchemas[typeof EdgeEvent.EVENT_NAMES.EDGE_CREATED]
          | EdgeEventSchemas[typeof EdgeEvent.EVENT_NAMES.EDGE_UPDATED]
          | EdgeEventSchemas[typeof EdgeEvent.EVENT_NAMES.EDGE_DELETED]
        >(event, [
          NodeEvent.EVENT_NAMES.NODE_CREATED,
          NodeEvent.EVENT_NAMES.NODE_UPDATED,
          NodeEvent.EVENT_NAMES.NODE_DELETED,
          EdgeEvent.EVENT_NAMES.EDGE_CREATED,
          EdgeEvent.EVENT_NAMES.EDGE_UPDATED,
          EdgeEvent.EVENT_NAMES.EDGE_DELETED,
        ])
      ) {
        if (event.data.flowId) {
          await step.run(
            `update flow updatedAt field after node changed`,
            async () => {
              logger.log(
                `${UPDATE_FLOW_UPDATED_AT_FUNCTION_ID} flowId: ${event.data.flowId}`,
              );
              return await flowService.patchFlow(event.data.flowId, {});
            },
          );
        }
      }
    },
  );
};
