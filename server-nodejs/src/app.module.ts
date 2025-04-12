import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FlowModule } from './flow/flow.module';
import { FlowEntity } from './flow/flow.entity';
import { NodeModule } from './node/node.module';
import { NodeEntity } from './node/node.entity';
import { EdgeModule } from './edge/edge.module';
import { EdgeEntity } from './edge/edge.entity';
import { InngestModule } from './inngest/inngest.module';
import { GeneratingTaskModule } from './generating-task/generating-task.module';
import { GeneratingTaskEntity } from './generating-task/generating-task.entity';
import { AiModule } from './ai/ai.module';
import getConfiguration from './utils/configuration';
import { type MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { type BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions';
import { S3Module } from 'nestjs-s3';
import { StorageModule } from './storage/storage.module';
import { FileEntity } from './file/file.entity';
import { FileReferenceEntity } from './file/file-reference.entity';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbType = configService.get<string>('db.type')?.toLowerCase();
        const baseOptions: Pick<
          TypeOrmModuleOptions,
          'entities' | 'synchronize'
        > = {
          entities: [
            FlowEntity,
            NodeEntity,
            EdgeEntity,
            GeneratingTaskEntity,
            FileEntity,
            FileReferenceEntity,
          ],
          synchronize: true,
        };

        switch (dbType) {
          case 'mysql':
            return {
              ...baseOptions,
              type: 'mysql',
              host: configService.get<string>('db.mysql.host'),
              port: configService.get<number>('db.mysql.port'),
              username: configService.get<string>('db.mysql.user'),
              password: configService.get<string>('db.mysql.password'),
              database: configService.get<string>('db.mysql.database'),
              synchronize: true,
            } satisfies MysqlConnectionOptions;
          case 'better-sqlite3':
            return {
              ...baseOptions,
              type: 'better-sqlite3',
              database: configService.get<string>('db.better-sqlite3.database'),
            } satisfies BetterSqlite3ConnectionOptions;
        }
        throw new Error('Unsupported database type: ' + dbType);
      },
      inject: [ConfigService],
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            endpoint: configService.get<string>('storage.s3.endpoint'),
            region: configService.get<string>('storage.s3.region'),
            credentials: {
              accessKeyId: configService.get<string>('storage.s3.accessKey'),
              secretAccessKey: configService.get<string>(
                'storage.s3.secretKey',
              ),
            },
            forcePathStyle: configService.get<boolean>(
              'storage.s3.forcePathStyle',
            ),
            signatureVersion: configService.get<string>(
              'storage.s3.forcePathStyle',
            ),
          },
        };
      },
    }),

    InngestModule,
    FlowModule,
    NodeModule,
    EdgeModule,
    GeneratingTaskModule,
    AiModule,
    StorageModule,
    FileModule,
  ],
})
export class AppModule {}
