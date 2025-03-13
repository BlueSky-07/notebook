import { Controller, Get, Param } from '@nestjs/common'
import { DocumentService } from './document.service'
import { DocumentFull, DocumentSlim } from './document.type'
import { FlowEntity } from '../flow/flow.entity'

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {
  }

  @Get('full/:flowId')
  getFullDocument(@Param('flowId') flowId: FlowEntity['id']): Promise<DocumentFull> {
    return this.documentService.getDocumentFull(flowId)
  }

  @Get('slim/:flowId')
  getSlimDocument(@Param('flowId') flowId: FlowEntity['id']): Promise<DocumentSlim> {
    return this.documentService.getDocumentSlim(flowId)
  }
}
