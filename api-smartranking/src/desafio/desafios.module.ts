/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafiosSchema } from './interfaces/desafios.schema';
import { PartidasSchema } from './interfaces/partidas.schema';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'partida', schema: PartidasSchema },
      { name: 'desafio', schema: DesafiosSchema },
    ]),
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
