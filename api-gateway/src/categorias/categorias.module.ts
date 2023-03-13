/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';

@Module({
  imports: [],
  controllers: [CategoriasController],
  providers: [],
})
export class CategoriasModule {}
