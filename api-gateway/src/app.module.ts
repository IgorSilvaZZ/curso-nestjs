/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';
import { DesafiosModule } from './desafios/desafios.module';
import { RankingsModule } from './rankings/rankings.module';
import { ProxyRMQModule } from './proxymq/proxymq.module';
import { ClientProxySmartRanking } from './proxymq/client-proxy';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
    RankingsModule,
    AwsModule,
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
