/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { CategoriasController } from './categorias.controller';
import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriasController],
})
export class CategoriasModule {}
