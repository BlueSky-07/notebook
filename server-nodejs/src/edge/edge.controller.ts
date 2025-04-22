import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EdgeService } from './edge.service';
import { EdgeEntity } from './edge.entity';
import {
  AdminDeleteEdgeByNodeIdInput,
  AdminDeleteEdgeByNodeIdResponse,
  BatchEdgeAddInput,
  BatchEdgeAddResponse,
  BatchEdgeDeleteInput,
  BatchEdgePatchInput,
  EdgeAddInput,
  EdgeAddResponse,
  EdgeDeleteResponse,
  EdgePatchInput,
} from './edge.dto';
import { omit } from 'lodash';

@Controller('edge')
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @Post('batch')
  async addEdges(
    @Body() batchEdgeAddInput: BatchEdgeAddInput,
  ): Promise<BatchEdgeAddResponse> {
    const ids = await this.edgeService.addEdges(batchEdgeAddInput.edges);
    return { ids };
  }

  @Patch('batch')
  patchEdges(
    @Body() batchEdgePatchInput: BatchEdgePatchInput,
  ): Promise<EdgeEntity[]> {
    return this.edgeService.patchEdges(batchEdgePatchInput.edges);
  }

  @Get('batch')
  async getEdges(@Param('id') ids: number[]): Promise<EdgeEntity[]> {
    return this.edgeService.getEdgesByIds(ids);
  }

  @Delete('batch')
  async deleteEdges(
    @Body() batchEdgeDeleteInput: BatchEdgeDeleteInput,
  ): Promise<EdgeDeleteResponse> {
    const done = await this.edgeService.deleteEdgesByIds(
      batchEdgeDeleteInput.ids,
    );
    return { done };
  }

  @Delete('admin/delete-by-node-id')
  async deleteEdgesByNodeId(
    @Body() adminDeleteEdgeByNodeIdInput: AdminDeleteEdgeByNodeIdInput,
  ): Promise<AdminDeleteEdgeByNodeIdResponse> {
    const deleteEdgeIds = await this.edgeService.deleteEdgesByNodeId(
      adminDeleteEdgeByNodeIdInput.dryRun,
      adminDeleteEdgeByNodeIdInput.nodeId,
    );
    return { ids: deleteEdgeIds, count: deleteEdgeIds.length };
  }

  @Post('')
  async addEdge(@Body() edgeAddInput: EdgeAddInput): Promise<EdgeAddResponse> {
    const id = await this.edgeService.addEdge(omit(edgeAddInput, 'id'));
    return { id };
  }

  @Patch(':id')
  patchEdge(
    @Param('id') id: number,
    @Body() edgePatchInput: EdgePatchInput,
  ): Promise<EdgeEntity> {
    return this.edgeService.patchEdge(id, edgePatchInput);
  }

  @Get(':id')
  async getEdge(@Param('id') id: number): Promise<EdgeEntity> {
    return this.edgeService.getEdge(id);
  }

  @Delete(':id')
  async deleteEdge(@Param('id') id: number): Promise<EdgeDeleteResponse> {
    const done = await this.edgeService.deleteEdge(id);
    return { done };
  }
}
