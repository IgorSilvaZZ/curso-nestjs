/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
