import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdgeEntity } from './edge.entity'
import { EdgeAddInput, EdgePatchInput } from './edge.type'
import { FlowEntity } from '../flow/flow.entity'

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(EdgeEntity)
    private edgeRepository: Repository<EdgeEntity>,
  ) {}

  async addEdge(edgeAddInput: EdgeAddInput): Promise<EdgeEntity['id']> {
    const res = await this.edgeRepository.insert({
      ...edgeAddInput,
      updatedAt: new Date()
    })
    return res.generatedMaps[0].id
  }

  async patchEdge(id: EdgeEntity['id'], edgePatchInput: EdgePatchInput): Promise<EdgeEntity> {
    await this.getEdge(id)
    const res = await this.edgeRepository.update(
      id,
      {
        ...edgePatchInput,
        updatedAt: new Date()
      }
    )
    if (res.affected) {
      return this.getEdge(id)
    } else {
      throw new InternalServerErrorException(`Edge does not update successfully`)
    }
  }

  async getEdge(id: EdgeEntity['id']): Promise<EdgeEntity> {
    const record = await this.edgeRepository.findOneBy({
      id
    })
    if (!record) {
      throw new NotFoundException(`Edge does not exist: ${id}`)
    }
    return record
  }

  getEdgesByFlowId(flowId: FlowEntity['id']): Promise<EdgeEntity[]> {
    return this.edgeRepository.findBy({
      flowId
    })
  }

  async deleteEdge(id: EdgeEntity['id']): Promise<boolean> {
    await this.getEdge(id)
    const res = await this.edgeRepository.delete({
      id
    })
    if (res.affected) {
      return true
    } else {
      throw new InternalServerErrorException(`Edge does not delete successfully`)
    }
  }
}
