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
import { NodeService } from './node.service';
import { NodeEntity } from './node.entity';
import {
  BatchNodeAddInput,
  BatchNodeAddResponse,
  BatchNodeDeleteInput,
  BatchNodePatchInput,
  NodeAddInput,
  NodeAddResponse,
  NodeDeleteResponse,
  NodePatchInput,
} from './node.dto';
import { omit } from 'lodash';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('batch')
  async addNodes(
    @Body() batchNodeAddInput: BatchNodeAddInput,
  ): Promise<BatchNodeAddResponse> {
    const ids = await this.nodeService.addNodes(batchNodeAddInput.nodes);
    return { ids };
  }

  @Patch('batch')
  patchNodes(
    @Body() batchNodePatchInput: BatchNodePatchInput,
  ): Promise<NodeEntity[]> {
    return this.nodeService.patchNodes(batchNodePatchInput.nodes);
  }

  @Get('batch')
  async getNodes(@Query('id') ids: number[]): Promise<NodeEntity[]> {
    return this.nodeService.getNodesByIds(ids);
  }

  @Delete('batch')
  async deleteNodes(
    @Body() batchNodeDeleteInput: BatchNodeDeleteInput,
  ): Promise<NodeDeleteResponse> {
    const done = await this.nodeService.deleteNodesByIds(
      batchNodeDeleteInput.ids,
    );
    return { done };
  }

  @Post('')
  async addNode(@Body() nodeAddInput: NodeAddInput): Promise<NodeAddResponse> {
    const id = await this.nodeService.addNode(omit(nodeAddInput, 'id'));
    return { id };
  }

  @Patch(':id')
  patchNode(
    @Param('id') id: number,
    @Body() nodePatchInput: NodePatchInput,
  ): Promise<NodeEntity> {
    return this.nodeService.patchNode(id, nodePatchInput);
  }

  @Get(':id')
  async getNode(@Param('id') id: number): Promise<NodeEntity> {
    return this.nodeService.getNode(id);
  }

  @Delete(':id')
  async deleteNode(@Param('id') id: number): Promise<NodeDeleteResponse> {
    const done = await this.nodeService.deleteNode(id);
    return { done };
  }
}
