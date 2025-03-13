import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FlowModule } from './flow/flow.module'
import { FlowEntity } from './flow/flow.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'notebook',
      entities: [FlowEntity],
      synchronize: true
    }),
    FlowModule
  ]
})
export class AppModule {}
