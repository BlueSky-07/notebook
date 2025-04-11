import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FlowService } from './flow.service';
import { FlowEntity } from './flow.entity';
import {
  FlowAddInput,
  FlowAddResponse,
  FlowDeleteResponse,
  FlowFull,
  FlowListInput,
  FlowListResponse,
  FlowPatchInput,
} from './flow.dto';
import { omit } from 'lodash';

@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get('full/:id')
  async getFlowFull(@Param('id') id: number): Promise<FlowFull> {
    return this.flowService.getFlowFull(id);
  }

  @Post('')
  async addFlow(@Body() flowAddInput: FlowAddInput): Promise<FlowAddResponse> {
    const id = await this.flowService.addFlow(omit(flowAddInput, 'id'));
    return { id };
  }

  @Patch(':id')
  patchFlow(
    @Param('id') id: number,
    @Body() flowPatchInput: FlowPatchInput,
  ): Promise<FlowEntity> {
    return this.flowService.patchFlow(id, flowPatchInput);
  }

  @Get(':id')
  async getFlow(@Param('id') id: number): Promise<FlowEntity> {
    return this.flowService.getFlow(id);
  }

  @Get('')
  async getAllFlows(
    @Query() flowListInput: FlowListInput,
  ): Promise<FlowListResponse> {
    return this.flowService.getAllFlows(flowListInput);
  }

  @Delete(':id')
  async deleteFlow(@Param('id') id: number): Promise<FlowDeleteResponse> {
    const done = await this.flowService.deleteFlow(id);
    return { done };
  }
}
