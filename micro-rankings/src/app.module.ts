/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { RankingsModule } from './rankings/rankings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
