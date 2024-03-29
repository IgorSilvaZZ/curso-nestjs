/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafiosSchema } from './interfaces/desafios.schema';

import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'desafio', schema: DesafiosSchema }]),
    ProxyRMQModule,
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService],
  exports: [DesafiosService],
})
export class DesafiosModule {}
