import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';
import { constants } from 'crypto';

async function bootstrap() {
  // Load the correct environment file
  const environment = process.env.NODE_ENV || 'development';
  dotenv.config({ path: `.env.${environment}` });

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.static(join(process.cwd(), './files/')));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
  app.enableCors();

  const useHttps = process.env.USE_HTTPS === 'true';
  const port = process.env.PORT || 5000;

  if (useHttps) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
    };
    const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());
    await server.listen(port, () => {
      console.log(`Server is running on https://localhost:${port}`);
    });
  } else {
    await app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}

bootstrap();
