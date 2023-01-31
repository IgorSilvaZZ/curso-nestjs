/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import moment from 'moment-timezone';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = (): any => {
    return moment(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(3333);
}
bootstrap();
