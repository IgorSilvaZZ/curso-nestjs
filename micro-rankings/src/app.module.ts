/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RankingsModule } from './rankings/rankings.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    RankingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProxyRMQModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
