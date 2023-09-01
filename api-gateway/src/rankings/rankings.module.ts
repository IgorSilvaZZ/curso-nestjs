/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';

import { ProxyRMQModule } from '../proxymq/proxymq.module';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
