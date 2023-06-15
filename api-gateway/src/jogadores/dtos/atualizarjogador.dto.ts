/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarJogadorDTO {
  /* @IsNotEmpty()
  readonly nome: string;

  @IsNotEmpty()
  readonly telefoneCelular: string; */

  @IsOptional()
  urlFotoJogador?: string;
}
