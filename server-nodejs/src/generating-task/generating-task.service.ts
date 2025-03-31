import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GeneratingTaskEntity,
  GeneratingTaskStatus,
} from './generating-task.entity';
import { FlowService } from '../flow/flow.service';
import { NodeService } from '../node/node.service';
import { EdgeService } from '../edge/edge.service';
import {
  GeneratingTaskAddInput,
  GeneratingTaskPatchInput,
} from './generating-task.type';
import { Repository } from 'typeorm';
import { InngestService } from '../inngest/inngest.service';
import * as Prompt from './prompt';
import GeneratingTaskEvent from './generating-task.event';

@Injectable()
export class GeneratingTaskService {
  constructor(
    @InjectRepository(GeneratingTaskEntity)
    private readonly generatingRepository: Repository<GeneratingTaskEntity>,
    @Inject(forwardRef(() => FlowService))
    private readonly flowService: FlowService,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
    @Inject(forwardRef(() => EdgeService))
    private readonly edgeService: EdgeService,
    @Inject(forwardRef(() => InngestService))
    private readonly inngestService: InngestService,
  ) {}

  async addGeneratingTask(
    generatingTaskAddInput: GeneratingTaskAddInput,
  ): Promise<GeneratingTaskEntity['id']> {
    const flowRecord = await this.flowService.getFlow(
      generatingTaskAddInput.flowId,
    );
    const nodeRecords = await this.nodeService.getNodesByIds(
      generatingTaskAddInput.input.sourceNodeIds ?? [],
    );
    const edgeRecords = await this.edgeService.getEdgesByIds(
      generatingTaskAddInput.input.edgeIds ?? [],
    );
    const targetNodeRecord = await this.nodeService.getNode(
      generatingTaskAddInput.targetNodeId,
    );
    const prompt = Prompt.generatePromptFromTargetNodeByNodesAndEdges(
      targetNodeRecord,
      nodeRecords,
      edgeRecords,
    );
    const res = await this.generatingRepository.insert({
      flowId: flowRecord.id,
      targetNodeId: generatingTaskAddInput.targetNodeId,
      input: {
        modelId: generatingTaskAddInput.input.modelId,
        prompt,
        sourceNodeSnapshots: nodeRecords,
        edgeSnapshots: edgeRecords,
      },
      status: GeneratingTaskStatus.Pending,
    });
    const generatingTaskId = res.generatedMaps[0].id as number;
    await GeneratingTaskEvent.trigger(
      this.inngestService.inngest,
      GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_CREATED,
      {
        generatingTaskId,
        targetNodeId: generatingTaskAddInput.targetNodeId,
        targetNodeDataType: targetNodeRecord.dataType,
      },
    );
    await GeneratingTaskEvent.trigger(
      this.inngestService.inngest,
      GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED,
      {
        generatingTaskId,
        targetNodeId: generatingTaskAddInput.targetNodeId,
        generatingTaskStatus: GeneratingTaskStatus.Pending,
      },
    );
    return generatingTaskId;
  }

  async patchGeneratingTask(
    id: GeneratingTaskEntity['id'],
    generatingTaskPatchInput: GeneratingTaskPatchInput,
  ): Promise<boolean> {
    const record = await this.getGeneratingTask(id);
    const res = await this.generatingRepository.update(
      id,
      generatingTaskPatchInput,
    );
    await GeneratingTaskEvent.trigger(
      this.inngestService.inngest,
      GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED,
      {
        generatingTaskId: id,
        targetNodeId: record.targetNodeId,
        generatingTaskStatus: generatingTaskPatchInput.status,
      },
    );
    if (res.affected) {
      return true;
    } else {
      throw new InternalServerErrorException(
        `Generating Task does not update successfully`,
      );
    }
  }

  async stopGeneratingTask(id: GeneratingTaskEntity['id']): Promise<boolean> {
    const record = await this.getGeneratingTask(id);
    if (
      ![GeneratingTaskStatus.Pending, GeneratingTaskStatus.Generating].includes(
        record.status,
      )
    ) {
      throw new InternalServerErrorException(
        `Generating Task does not in running`,
      );
    }
    const res = await this.generatingRepository.update(id, {
      status: GeneratingTaskStatus.Stopped,
    });
    await GeneratingTaskEvent.trigger(
      this.inngestService.inngest,
      GeneratingTaskEvent.EVENT_NAMES.GENERATING_TASK_STATUS_UPDATED,
      {
        generatingTaskId: id,
        targetNodeId: record.targetNodeId,
        generatingTaskStatus: GeneratingTaskStatus.Stopped,
      },
    );
    if (res.affected) {
      return true;
    } else {
      throw new InternalServerErrorException(
        `Generating Task does not update successfully`,
      );
    }
  }

  async getGeneratingTask(
    id: GeneratingTaskEntity['id'],
  ): Promise<GeneratingTaskEntity> {
    if (!id) throw new BadRequestException(`Generating Task id is missing`);
    const record = await this.generatingRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Generating Task does not exist: ${id}`);
    }
    return record;
  }
}
