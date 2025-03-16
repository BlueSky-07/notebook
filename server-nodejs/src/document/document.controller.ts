import { Controller, Get, Param } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentFull, DocumentSlim } from './document.type';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('full/:flowId')
  getFullDocument(@Param('flowId') flowId: number): Promise<DocumentFull> {
    return this.documentService.getDocumentFull(flowId);
  }

  @Get('slim/:flowId')
  getSlimDocument(@Param('flowId') flowId: number): Promise<DocumentSlim> {
    return this.documentService.getDocumentSlim(flowId);
  }
}
