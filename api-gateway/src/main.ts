import { NestFactory } from '@nestjs/core';
import moment from 'moment-timezone';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LogginInterceptor } from './interceptors/loggin.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LogginInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = (): any => {
    return moment(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(3333);
}
bootstrap();
