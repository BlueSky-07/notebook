import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { NodeService } from './node.service'
import { NodeEntity } from './node.entity'
import { NodeAddInput, NodeAddResponse, NodeDeleteResponse, NodePatchInput } from './node.type'
import { omit } from 'lodash'

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {
  }

  @Post('')
  async addNode(@Body() nodeAddInput: NodeAddInput): Promise<NodeAddResponse> {
    const id = await this.nodeService.addNode(omit(nodeAddInput, 'id'))
    return { id }
  }

  @Patch(':id')
  patchNode(@Param('id') id: number, @Body() nodePatchInput: NodePatchInput): Promise<NodeEntity> {
    return this.nodeService.patchNode(id, nodePatchInput)
  }

  @Get(':id')
  async getNode(@Param('id') id: number): Promise<NodeEntity> {
    return this.nodeService.getNode(id)
  }

  @Delete(':id')
  async deleteNode(@Param('id') id: number): Promise<NodeDeleteResponse> {
    const done = await this.nodeService.deleteNode(id)
    return { done }
  }
}
