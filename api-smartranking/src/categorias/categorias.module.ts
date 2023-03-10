/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriasSchema } from './interfaces/categoria. schema';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'categoria', schema: CategoriasSchema },
    ]),
    JogadoresModule,
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
