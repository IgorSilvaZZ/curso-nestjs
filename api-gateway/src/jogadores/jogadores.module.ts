/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [],
  controllers: [JogadoresController],
  providers: [],
})
export class JogadoresModule {}
