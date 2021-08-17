import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import {
  HttpExceptionFilter,
  ValidationException,
} from '@grazz/integration-service';

export class MakeService {
  static async start(appModule: any) {
    const app = await NestFactory.create(appModule);
    app.use(compression());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => new ValidationException(errors),
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('v1');
    await app.listen(process.env.PORT || 3000);
  }
}
