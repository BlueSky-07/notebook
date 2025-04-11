import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiModelsResponse } from './ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('models')
  getModels(): AiModelsResponse {
    return this.aiService.getModels();
  }
}
