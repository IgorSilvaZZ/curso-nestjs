/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { DesafiosController } from './desafios.controller';
import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  controllers: [DesafiosController],
  imports: [ProxyRMQModule],
})
export class DesafiosModule {}
