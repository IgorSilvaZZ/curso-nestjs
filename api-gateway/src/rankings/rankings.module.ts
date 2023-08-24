/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';

import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [RankingsController],
})
export class RankingsModule {}
