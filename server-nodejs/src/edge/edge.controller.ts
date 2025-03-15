import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { EdgeService } from './edge.service'
import { EdgeEntity } from './edge.entity'
import { EdgeAddInput, EdgeAddResponse, EdgeDeleteResponse, EdgePatchInput } from './edge.type'
import { omit } from 'lodash'

@Controller('edge')
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {
  }

  @Post('')
  async addEdge(@Body() edgeAddInput: EdgeAddInput): Promise<EdgeAddResponse> {
    const id = await this.edgeService.addEdge(omit(edgeAddInput, 'id'))
    return { id }
  }

  @Patch(':id')
  patchEdge(@Param('id') id: number, @Body() edgePatchInput: EdgePatchInput): Promise<EdgeEntity> {
    return this.edgeService.patchEdge(id, edgePatchInput)
  }

  @Get(':id')
  async getEdge(@Param('id') id: number): Promise<EdgeEntity> {
    return this.edgeService.getEdge(id)
  }

  @Delete(':id')
  async deleteEdge(@Param('id') id: number): Promise<EdgeDeleteResponse> {
    const done = await this.edgeService.deleteEdge(id)
    return { done }
  }
}
