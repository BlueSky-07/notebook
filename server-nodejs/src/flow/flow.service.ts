import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowEntity } from './flow.entity'
import { FlowAddInput, FlowPatchInput } from './flow.type'

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(FlowEntity)
    private flowRepository: Repository<FlowEntity>,
  ) {}

  async addFlow(flowAddInput: FlowAddInput): Promise<FlowEntity['id']> {
    const res = await this.flowRepository.insert({
      ...flowAddInput,
      updatedAt: new Date()
    })
    return res.generatedMaps[0].id
  }

  async patchFlow(id: FlowEntity['id'], flowPatchInput: FlowPatchInput): Promise<FlowEntity> {
    await this.getFlow(id)
    const res = await this.flowRepository.update(
      id,
      {
        ...flowPatchInput,
        updatedAt: new Date()
      },
    )
    if (res.affected) {
      return this.getFlow(id)
    } else {
      throw new InternalServerErrorException(`Flow does not update successfully`)
    }
  }

  async getFlow(id: FlowEntity['id']): Promise<FlowEntity> {
    const record = await this.flowRepository.findOneBy({
      id
    })
    if (!record) {
      throw new NotFoundException(`Flow does not exist: ${id}`)
    }
    return record
  }

  async deleteFlow(id: FlowEntity['id']): Promise<boolean> {
    await this.getFlow(id)
    const res = await this.flowRepository.delete({
      id
    })
    if (res.affected) {
      return true
    } else {
      throw new InternalServerErrorException(`Flow does not delete successfully`)
    }
  }
}
