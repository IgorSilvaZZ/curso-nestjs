/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresSchema } from './interfaces/jogador.schema';

import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'jogador', schema: JogadoresSchema }]),
    CategoriasModule,
  ],
  providers: [JogadoresService],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
