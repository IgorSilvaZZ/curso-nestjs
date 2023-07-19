/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';

@Module({
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
