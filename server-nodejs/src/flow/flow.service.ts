import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowEntity } from './flow.entity';
import { FlowAddInput, FlowListResponse, FlowPatchInput } from './flow.type';
import { PaginationFindOptions } from '../utils/pagination';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(FlowEntity)
    private readonly flowRepository: Repository<FlowEntity>,
  ) {}

  async addFlow(flowAddInput: FlowAddInput): Promise<FlowEntity['id']> {
    const res = await this.flowRepository.insert({
      ...flowAddInput,
      updatedAt: new Date(),
    });
    return res.generatedMaps[0].id as number;
  }

  async patchFlow(
    id: FlowEntity['id'],
    flowPatchInput: FlowPatchInput,
  ): Promise<FlowEntity> {
    await this.getFlow(id);
    const res = await this.flowRepository.update(id, {
      ...flowPatchInput,
      updatedAt: new Date(),
    });
    if (res.affected) {
      return this.getFlow(id);
    } else {
      throw new InternalServerErrorException(
        `Flow does not update successfully`,
      );
    }
  }

  async getFlow(id: FlowEntity['id']): Promise<FlowEntity> {
    const record = await this.flowRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`Flow does not exist: ${id}`);
    }
    return record;
  }

  async getAllFlows(
    paginationOptions: PaginationFindOptions,
  ): Promise<FlowListResponse> {
    const [items, count] = await this.flowRepository.findAndCount({
      ...paginationOptions,
    });
    return {
      items,
      count,
    };
  }

  async deleteFlow(id: FlowEntity['id']): Promise<boolean> {
    await this.getFlow(id);
    const res = await this.flowRepository.delete({
      id,
    });
    if (res.affected) {
      return true;
    } else {
      throw new InternalServerErrorException(
        `Flow does not delete successfully`,
      );
    }
  }
}
