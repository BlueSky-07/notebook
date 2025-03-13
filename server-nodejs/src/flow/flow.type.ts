import { FlowEntity } from './flow.entity'
import { ApiProperty } from '@nestjs/swagger'

export class FlowAddInput {
  @ApiProperty({ type: String })
  name: FlowEntity['name']
  @ApiProperty({ type: String })
  author: FlowEntity['author']
}

export class FlowAddResponse {
  @ApiProperty({ type: Number })
  id: FlowEntity['id']
}
export class FlowPatchInput  {
  @ApiProperty({ type: String, required: false })
  name?: FlowEntity['name']
  @ApiProperty({ type: String, required: false })
  author?: FlowEntity['author']
}
export class FlowDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean
}

