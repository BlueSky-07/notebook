import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FlowModule } from './flow/flow.module'
import { FlowEntity } from './flow/flow.entity'
import { NodeModule } from './node/node.module'
import { NodeEntity } from './node/node.entity'
import { EdgeModule } from './edge/edge.module'
import { EdgeEntity } from './edge/edge.entity'
import { DocumentModule } from './document/document.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'notebook',
      entities: [FlowEntity, NodeEntity, EdgeEntity],
      synchronize: true
    }),
    DocumentModule,
    FlowModule,
    NodeModule,
    EdgeModule,
  ]
})
export class AppModule {}
