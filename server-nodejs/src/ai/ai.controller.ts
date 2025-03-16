import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiInfoResponse } from './ai.type';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('info')
  getInfo(): AiInfoResponse {
    return this.aiService.getInfo();
  }
}
