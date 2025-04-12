import { Logger } from '@nestjs/common';
import { Inngest } from 'inngest';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { matchEventNames } from '../../inngest/helper';
import NodeEvent, { NodeEventSchemas } from '../../node/node.event';
import { FileReferenceService } from '../file-reference.service';
import { FileReferenceSourceType } from '../file-reference.entity';
import { NodeService } from '../../node/node.service';

export interface UpdateFileReferencesForNodeDependencies {
  logger: Logger;
  fileReferenceService: FileReferenceService;
  nodeService: NodeService;
}

const UPDATE_FILE_REFERENCE_FOR_NODE_FUNCTION_ID =
  'job/update-file-reference-for-node';

export const createUpdateFileReferencesForNodeFunction = (
  inngest: Inngest,
  dependencies: UpdateFileReferencesForNodeDependencies,
) => {
  const { logger, fileReferenceService, nodeService } = dependencies;
  return inngest.createFunction(
    {
      id: UPDATE_FILE_REFERENCE_FOR_NODE_FUNCTION_ID,
      retries: 0,
      debounce: {
        period: '10s',
        key: 'event.data.nodeId',
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
          NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_CREATED]
        >(event, [NodeEvent.EVENT_NAMES.NODE_CREATED])
      ) {
        const { nodeId } = event.data;
        await step.run(`update file reference after node created`, async () => {
          logger.log(`update file reference after node created: ${nodeId}`);
          const node = await nodeService.getNode(nodeId);
          const fileIds = await nodeService.extractFileIdsFromNodeData(node);
          if (fileIds.length === 0) {
            return;
          }
          await fileReferenceService.addFileReferences(
            FileReferenceSourceType.Node,
            nodeId,
            fileIds,
          );
          return { fileIds };
        });
      } else if (
        matchEventNames<
          NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_UPDATED]
        >(event, [NodeEvent.EVENT_NAMES.NODE_UPDATED])
      ) {
        const { nodeId } = event.data;
        await step.run(`update file reference after node updated`, async () => {
          logger.log(`update file reference after node updated: ${nodeId}`);
          await fileReferenceService.deleteFileReferences(
            FileReferenceSourceType.Node,
            nodeId,
          );
          const node = await nodeService.getNode(nodeId);
          const fileIds = await nodeService.extractFileIdsFromNodeData(node);
          if (fileIds.length === 0) {
            return;
          }
          await fileReferenceService.addFileReferences(
            FileReferenceSourceType.Node,
            nodeId,
            fileIds,
          );
          return { fileIds };
        });
      } else if (
        matchEventNames<
          NodeEventSchemas[typeof NodeEvent.EVENT_NAMES.NODE_DELETED]
        >(event, [NodeEvent.EVENT_NAMES.NODE_DELETED])
      ) {
        const { nodeId } = event.data;
        await step.run(`update file reference after node deleted`, async () => {
          logger.log(`update file reference after node deleted: ${nodeId}`);
          await fileReferenceService.deleteFileReferences(
            FileReferenceSourceType.Node,
            nodeId,
          );
        });
      }
    },
  );
};
