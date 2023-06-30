import { Module } from '@nestjs/common';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';

@Module({
  controllers: [PartidasController],
  providers: [PartidasService]
})
export class PartidasModule {}
