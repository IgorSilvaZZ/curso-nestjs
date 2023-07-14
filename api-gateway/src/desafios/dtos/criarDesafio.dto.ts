/* eslint-disable prettier/prettier */

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { IJogador } from '../../jogadores/interfaces/jogador.interface';

export class CriarDesafioDTO {
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  categoria: string;

  @IsNotEmpty()
  solicitante: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jogadores: IJogador[];
}
