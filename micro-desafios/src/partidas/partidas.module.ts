/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';
import { PartidasSchema } from './interfaces/partidas.schema';
import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'partida', schema: PartidasSchema }]),
    ProxyRMQModule,
  ],
  controllers: [PartidasController],
  providers: [PartidasService],
})
export class PartidasModule {}
