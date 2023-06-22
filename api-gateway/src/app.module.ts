/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
})
export class AppModule {}
