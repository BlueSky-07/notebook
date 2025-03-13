import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { EdgeService } from './edge.service'
import { EdgeEntity } from './edge.entity'
import { EdgeAddInput, EdgeAddResponse, EdgeDeleteResponse, EdgePatchInput } from './edge.type'

@Controller('edge')
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {
  }

  @Post('')
  async addEdge(@Body() flowAddInput: EdgeAddInput): Promise<EdgeAddResponse> {
    const id = await this.edgeService.addEdge(flowAddInput)
    return { id }
  }

  @Patch(':id')
  patchEdge(@Param('id') id: number, @Body() flowPatchInput: EdgePatchInput): Promise<EdgeEntity> {
    return this.edgeService.patchEdge(id, flowPatchInput)
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
