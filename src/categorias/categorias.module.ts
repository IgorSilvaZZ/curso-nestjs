/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriasSchema } from './interfaces/categoria. schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'categoria', schema: CategoriasSchema },
    ]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
