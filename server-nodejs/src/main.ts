import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenApiNestFactory } from 'nest-openapi-tools';
import { DocumentBuilder } from '@nestjs/swagger';
import * as process from 'node:process';
import { serve } from 'inngest/express';
import { InngestService } from './inngest/inngest.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || '9001';
  const isDev = configService.get<string>('NODE_ENV') !== 'production';

  if (isDev) {
    await OpenApiNestFactory.configure(
      app,
      new DocumentBuilder().setTitle('Notebook Server'),
      {
        webServerOptions: {
          enabled: true,
          path: 'api-docs',
        },
        fileGeneratorOptions: {
          enabled: true,
          outputFilePath: './openapi.yaml', // or ./openapi.json
        },
        clientGeneratorOptions: {
          enabled: true,
          type: 'typescript-axios',
          outputFolderPath: '../web/api-generated',
          additionalProperties:
            'apiPackage=clients,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true',
          openApiFilePath: './openapi.yaml', // or ./openapi.json
          skipValidation: true, // optional, false by default
        },
      },
    );
  }

  const inngestService = app.get(InngestService);

  // Setup inngest
  app.useBodyParser('json', { limit: '10mb' });
  app.use(
    '/inngest',
    serve({
      client: inngestService.inngest,
      functions: inngestService.functions,
    }),
  );

  await app.listen(port);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
