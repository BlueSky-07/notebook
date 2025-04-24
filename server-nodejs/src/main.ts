import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { serve as InngestServe } from 'inngest/express';
import { InngestService } from './inngest/inngest.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { type NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import type { RegisterOptions } from 'inngest/types';
import { configModule } from './config/config.module';
const isDev = process.env.NODE_ENV !== 'production';

async function bootstrap() {
  let app: NestExpressApplication;
  const appOptions: NestApplicationOptions = { bodyParser: true };
  const configService = (
    await NestFactory.create<NestExpressApplication>(configModule)
  ).get(ConfigService);

  if (!isDev) {
    const cors = configService.get<CorsOptions>('app.cors');
    const httpsOptions = configService.get<HttpsOptions>('app.httpsOptions');
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      ...appOptions,
      httpsOptions,
      cors,
    });
    const globalPrefix = configService.get<string>('app.globalPrefix');
    if (globalPrefix) {
      app.setGlobalPrefix(globalPrefix);
    }
  } else {
    const { OpenApiNestFactory } = require('nest-openapi-tools');
    const { DocumentBuilder } = require('@nestjs/swagger');
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      appOptions,
    );
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
          enabled: false, // use docker compose to generate
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
  const port = configService.get<string>('app.port') || '9001';
  app.useBodyParser('json', { limit: '10mb' });

  if (!configService.get<boolean>('inngest.register.disabled')) {
    // Register to Inngest
    const inngestService = app.get(InngestService);
    app.use(
      configService.get<RegisterOptions['servePath']>(
        'inngest.register.servePath',
      ) || '/inngest',
      InngestServe({
        ...configService.get<RegisterOptions>('inngest.register'),
        client: inngestService.inngest,
        functions: inngestService.functions,
      }),
    );
  }

  await app.listen(port);
}

bootstrap()
  .then(() => {
    const signalHandler = () => {
      process.exit();
    };

    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGQUIT', signalHandler);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
