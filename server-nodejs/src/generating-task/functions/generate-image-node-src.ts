import { Logger } from '@nestjs/common';
import { Inngest, NonRetriableError } from 'inngest';
import { GeneratingTaskStatus } from '../generating-task.entity';
import { GeneratingTaskService } from '../generating-task.service';
import { AiService } from '../../ai/ai.service';
import { experimental_generateImage as generateImage } from 'ai';
import GeneratingTaskEvent, {
  GeneratingTaskEventSchemas,
} from '../generating-task.event';
import { StandardEventSchema } from 'inngest/components/EventSchemas';
import { matchEventNames } from '../../inngest/helper';
import { NodeDataType } from '../../node/node.entity';
import { FileService } from '../../file/file.service';
import { STORAGE_BUCKET_NAME } from '../../storage/storage.const';
import { get } from 'lodash';

export interface GenerateImageNodeSrcFunctionDependencies {
  logger: Logger;
  generatingTaskService: GeneratingTaskService;
  aiService: AiService;
  fileService: FileService;
}

const GenerateImageNodeSrcErrors = {
  EmptyPrompt: new NonRetriableError('Empty Prompt'),
  NotGenerating: new NonRetriableError(
    'Generating Task status is not generating',
  ),
  EmptyGenerated: new NonRetriableError('Empty Generated'),
  ModelNotFound: new NonRetriableError('Model not found'),
  ModelNotSupport: new NonRetriableError('Model not support generating image'),
};

const GENERATE_IMAGE_NODE_SRC_FUNCTION_ID = 'job/generate-image-node-src';

export const createGenerateImageNodeSrcFunction = (
  inngest: Inngest,
  dependencies: GenerateImageNodeSrcFunctionDependencies,
) => {
  const { logger, generatingTaskService, aiService, fileService } =
    dependencies;
  return inngest.createFunction(
    {
      id: GENERATE_IMAGE_NODE_SRC_FUNCTION_ID,
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
      if: `event.data.targetNodeDataType == "${NodeDataType.Image}"`,
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
          `${GENERATE_IMAGE_NODE_SRC_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Pending`,
        );
        const record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (
          record.input.prompt?.[0] &&
          (record.input.prompt[0].text || record.input.prompt[0].src)
        )
          return 'prompt is not empty, continue';
        await generatingTaskService.patchGeneratingTask(
          event.data.generatingTaskId,
          {
            status: GeneratingTaskStatus.Failed,
            output: {
              generatedFile: null,
              errorMessage: GenerateImageNodeSrcErrors.EmptyPrompt.message,
            },
          },
        );
        throw GenerateImageNodeSrcErrors.EmptyPrompt;
      });

      await step.run(`set status to generating`, async () => {
        logger.log(
          `${GENERATE_IMAGE_NODE_SRC_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Generating`,
        );
        await generatingTaskService.patchGeneratingTask(
          event.data.generatingTaskId,
          {
            status: GeneratingTaskStatus.Generating,
            output: {
              generatedFile: null,
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
          throw GenerateImageNodeSrcErrors.NotGenerating;
        const models = aiService.getModel(record.input.modelId);
        if (!models) throw GenerateImageNodeSrcErrors.ModelNotFound;
        const model = models.image;
        if (!model) throw GenerateImageNodeSrcErrors.ModelNotSupport;

        const generatedImageResult = await step.ai.wrap(
          'generating',
          generateImage,
          {
            model,
            prompt:
              await generatingTaskService.prepareGeneratingTaskStringPrompt(
                record.input.prompt,
              ),
            // size: '512x512',
            n: 1,
          },
        );

        record = await generatingTaskService.getGeneratingTask(
          event.data.generatingTaskId,
        );
        if (record.status !== GeneratingTaskStatus.Generating)
          throw GenerateImageNodeSrcErrors.NotGenerating;

        const generatedImage = generatedImageResult.images?.[0];
        if (generatedImage) {
          await step.run(`generated done`, async () => {
            logger.log(
              `${GENERATE_IMAGE_NODE_SRC_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Done`,
            );
            const buffer = Buffer.from(
              [
                get(generatedImage, ['base64']),
                get(generatedImage, ['base64Data']), // xAI grok-2-image-1212
              ].find(Boolean),
              'base64',
            );
            const file = await fileService.addFile(
              STORAGE_BUCKET_NAME.GENERATED,
              {
                buffer: buffer,
                size: buffer.byteLength,
                originalname: 'generated.jpg',
                mimetype: generatedImage.mimeType || 'image/jpeg',
              },
            );
            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Done,
                output: {
                  generatedFile: file.id,
                },
              },
            );
          });
        } else {
          await step.run(`generated empty`, async () => {
            logger.log(
              `${GENERATE_IMAGE_NODE_SRC_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
            );

            await generatingTaskService.patchGeneratingTask(
              event.data.generatingTaskId,
              {
                status: GeneratingTaskStatus.Failed,
                output: {
                  generatedFile: null,
                  errorMessage:
                    GenerateImageNodeSrcErrors.EmptyGenerated.message,
                },
              },
            );
          });
        }
      } catch (error) {
        if (error === GenerateImageNodeSrcErrors.NotGenerating) return;
        await step.run(`generated failed`, async () => {
          logger.log(
            `${GENERATE_IMAGE_NODE_SRC_FUNCTION_ID} taskId: ${event.data.generatingTaskId}, targetNodeId: ${event.data.targetNodeId} Failed`,
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
