import { Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import NodeEvent, { NodeEventSchemas } from '../../node/node.event';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { matchEventNames } from '../../inngest/helper';
import { EdgeService } from '../edge.service';

export interface DeleteEdgesAfterNodeDeletedDependencies {
  logger: Logger;
  edgeService: EdgeService;
}

const DELETE_EDGES_AFTER_NODE_DELETED = 'job/delete-edges-after-node-deleted';

export const createDeleteEdgesAfterNodeDeleted = (
  inngest: Inngest,
  dependencies: DeleteEdgesAfterNodeDeletedDependencies,
) => {
  const { logger, edgeService } = dependencies;
  return inngest.createFunction(
    { id: DELETE_EDGES_AFTER_NODE_DELETED, retries: 3 },
    [{ event: NodeEvent.EVENT_NAMES.NODE_DELETED }],
    async (props) => {
      const { step } = props;
      const event = props.event as StandardEventSchema;
      if (
        matchEventNames<
          NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_DELETED]
        >(event, [NodeEvent.EVENT_NAMES.NODE_DELETED])
      ) {
        if (event.data.nodeId) {
          await step.run('delete edges after node deleted', async () => {
            logger.log(`delete edges after node deleted: ${event.data.nodeId}`);
            const deletedEdgeIds = await edgeService.deleteEdgesByNodeId(
              event.data.nodeId,
            );
            return {
              deletedEdgeIds,
            };
          });
        }
      }
    },
  );
};
