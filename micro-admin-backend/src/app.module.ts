/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JogadoresSchema } from './interfaces/jogadores/jogador.schema';
import { CategoriasSchema } from './interfaces/categorias/categoria. schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:senha@localhost:27017/sradmbackend?authMechanism=DEFAULT&authSource=admin&directConnection=true',
    ),
    MongooseModule.forFeature([{ name: 'jogador', schema: JogadoresSchema }]),
    MongooseModule.forFeature([
      { name: 'categoria', schema: CategoriasSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
