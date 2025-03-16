import {
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
import GeneratingTaskCreatedFunction from '../inngest/functions/generating-task-created';
import GeneratingTaskStatusChangedFunction from '../inngest/functions/generating-task-status-changed';
import * as Prompt from './prompt';

@Injectable()
export class GeneratingTaskService {
  constructor(
    @InjectRepository(GeneratingTaskEntity)
    private readonly generatingRepository: Repository<GeneratingTaskEntity>,
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
        prompt,
        sourceNodeSnapshots: nodeRecords,
        edgeSnapshots: edgeRecords,
      },
      status: GeneratingTaskStatus.Pending,
      updatedAt: new Date(),
    });
    const generatingTaskId = res.generatedMaps[0].id as number;
    await GeneratingTaskCreatedFunction.trigger(this.inngestService.inngest, {
      generatingTaskId,
      targetNodeId: generatingTaskAddInput.targetNodeId,
    });
    await GeneratingTaskStatusChangedFunction.trigger(
      this.inngestService.inngest,
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
    const res = await this.generatingRepository.update(id, {
      ...generatingTaskPatchInput,
      updatedAt: new Date(),
    });
    await GeneratingTaskStatusChangedFunction.trigger(
      this.inngestService.inngest,
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
      updatedAt: new Date(),
    });
    await GeneratingTaskStatusChangedFunction.trigger(
      this.inngestService.inngest,
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
    const record = await this.generatingRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Generating Task does not exist: ${id}`);
    }
    return record;
  }
}
