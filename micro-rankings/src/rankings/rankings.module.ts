/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RankingSchema } from './interfaces/ranking.schema';

import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';

import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'rankings', schema: RankingSchema }]),
    ProxyRMQModule,
  ],
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
