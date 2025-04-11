import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  GeneratingTaskAddInput,
  GeneratingTaskAddResponse,
  GeneratingTaskStopResponse,
} from './generating-task.dto';
import { omit } from 'lodash';
import { GeneratingTaskEntity } from './generating-task.entity';
import { GeneratingTaskService } from './generating-task.service';

@Controller('generating-task')
export class GeneratingTaskController {
  constructor(private readonly generatingTaskService: GeneratingTaskService) {}

  @Post('')
  async addGeneratingTask(
    @Body() generatingTaskAddInput: GeneratingTaskAddInput,
  ): Promise<GeneratingTaskAddResponse> {
    const id = await this.generatingTaskService.addGeneratingTask(
      omit(generatingTaskAddInput, 'id'),
    );
    return { id };
  }

  @Post(':id/stop')
  async stopGeneratingTask(
    @Param('id') id: number,
  ): Promise<GeneratingTaskStopResponse> {
    const done = await this.generatingTaskService.stopGeneratingTask(id);
    return { done };
  }

  @Get(':id')
  getGeneratingTask(@Param('id') id: number): Promise<GeneratingTaskEntity> {
    return this.generatingTaskService.getGeneratingTask(id);
  }
}
