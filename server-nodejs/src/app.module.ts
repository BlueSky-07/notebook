import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FlowModule } from './flow/flow.module'
import { FlowEntity } from './flow/flow.entity'
import { NodeModule } from './node/node.module'
import { NodeEntity } from './node/node.entity'
import { EdgeModule } from './edge/edge.module'
import { EdgeEntity } from './edge/edge.entity'
import { DocumentModule } from './document/document.module'
import { InngestModule } from './inngest/inngest.module'
import { GeneratingTaskModule } from './generating-task/generating-task.module'
import { GeneratingTaskEntity } from './generating-task/generating-task.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.aksk.env', '.development.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USER'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DATABASE'),
          entities: [FlowEntity, NodeEntity, EdgeEntity, GeneratingTaskEntity],
          synchronize: true
        }
      },
      inject: [ConfigService],
    }),
    InngestModule,
    DocumentModule,
    FlowModule,
    NodeModule,
    EdgeModule,
    GeneratingTaskModule,
  ],
  providers: [Logger]
})
export class AppModule {}
