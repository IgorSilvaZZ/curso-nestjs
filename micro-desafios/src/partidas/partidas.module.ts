/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';
import { PartidasSchema } from './interfaces/partidas.schema';
import { ProxyRMQModule } from '../proxymq/proxymq.module';
import { DesafiosService } from '../desafios/desafios.service';
import { DesafiosSchema } from '../desafios/interfaces/desafios.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'partida', schema: PartidasSchema },
      { name: 'desafio', schema: DesafiosSchema },
    ]),
    ProxyRMQModule,
  ],
  controllers: [PartidasController],
  providers: [PartidasService, DesafiosService],
})
export class PartidasModule {}
