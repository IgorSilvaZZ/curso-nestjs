/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { DesafiosController } from './desafios.controller';
import { ProxyRMQModule } from '../proxymq/proxymq.module';
import { DesafiosService } from './desafios.service';

@Module({
  controllers: [DesafiosController],
  imports: [ProxyRMQModule],
  providers: [DesafiosService],
})
export class DesafiosModule {}
