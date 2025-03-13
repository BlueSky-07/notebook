import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NodeEntity } from './node.entity'
import { NodeAddInput, NodePatchInput } from './node.type'
import { FlowEntity } from '../flow/flow.entity'

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(NodeEntity)
    private nodeRepository: Repository<NodeEntity>,
  ) {}

  async addNode(nodeAddInput: NodeAddInput): Promise<NodeEntity['id']> {
    const res = await this.nodeRepository.insert({
      ...nodeAddInput,
      updatedAt: new Date()
    })
    return res.generatedMaps[0].id
  }

  async patchNode(id: NodeEntity['id'], nodePatchInput: NodePatchInput): Promise<NodeEntity> {
    await this.getNode(id)
    const res = await this.nodeRepository.update(
      id,
      {
        ...nodePatchInput,
        updatedAt: new Date()
      }
    )
    if (res.affected) {
      return this.getNode(id)
    } else {
      throw new InternalServerErrorException(`Node does not update successfully`)
    }
  }

  async getNode(id: NodeEntity['id']): Promise<NodeEntity> {
    const record = await this.nodeRepository.findOneBy({
      id
    })
    if (!record) {
      throw new NotFoundException(`Node does not exist: ${id}`)
    }
    return record
  }

  getNodesByFlowId(flowId: FlowEntity['id']): Promise<NodeEntity[]> {
    return this.nodeRepository.findBy({
      flowId
    })
  }

  async deleteNode(id: NodeEntity['id']): Promise<boolean> {
    await this.getNode(id)
    const res = await this.nodeRepository.delete({
      id
    })
    if (res.affected) {
      return true
    } else {
      throw new InternalServerErrorException(`Node does not delete successfully`)
    }
  }
}
