/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';

import { JogadoresService } from './jogadores.service';

@Controller()
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}
}
