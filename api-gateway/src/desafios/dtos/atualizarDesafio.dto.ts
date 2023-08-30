/* eslint-disable prettier/prettier */

import { IsEnum, IsOptional } from 'class-validator';

import { IDesafioAtualizarStatusEnum } from '../interfaces/desafio-status.enum';

export class AtualizarDesafioDTO {
  @IsOptional()
  @IsEnum(IDesafioAtualizarStatusEnum)
  status: string;
}
