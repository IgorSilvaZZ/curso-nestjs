/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasSchema } from '../interfaces/categorias/categoria. schema';
import { JogadoresSchema } from '../interfaces/jogadores/jogador.schema';

import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'jogador', schema: JogadoresSchema }]),
    MongooseModule.forFeature([
      { name: 'categoria', schema: CategoriasSchema },
    ]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
