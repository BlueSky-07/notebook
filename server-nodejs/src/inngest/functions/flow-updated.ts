import { Logger } from '@nestjs/common';
import { FlowService } from '../../flow/flow.service';
import { Inngest } from 'inngest';

export type FlowUpdatedEvent = {
  data: {
    flowId: number;
  };
};

export const FLOW_UPDATED_ID = 'flow.updated';
export const FLOW_UPDATED_EVENT_NAME = `job/${FLOW_UPDATED_ID}`;

export interface FlowUpdatedFunctionDependencies {
  logger: Logger;
  flowService: FlowService;
}

const createFlowUpdatedFunction = (
  inngest: Inngest,
  dependencies: FlowUpdatedFunctionDependencies,
) => {
  const { logger, flowService } = dependencies;
  return inngest.createFunction(
    { id: FLOW_UPDATED_ID as string },
    { event: FLOW_UPDATED_EVENT_NAME as string },
    async (props) => {
      const { step } = props;
      const event = props.event as FlowUpdatedEvent;
      await step.run(`update flow udpatedAt field`, async () => {
        logger.log(`[FlowUpdatedFunction] flowId: ${event.data.flowId}`);
        return await flowService.patchFlow(event.data.flowId, {});
      });
    },
  );
};

const triggerFlowUpdatedFunction = (
  inngest: Inngest,
  eventData: FlowUpdatedEvent['data'],
) => {
  return inngest.send({
    name: FLOW_UPDATED_EVENT_NAME,
    data: eventData,
  });
};

export default {
  create: createFlowUpdatedFunction,
  trigger: triggerFlowUpdatedFunction,
};
