/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsEmail } from 'class-validator';

export class CriarJogadorDTO {
  @IsNotEmpty()
  readonly nome: string;

  @IsEmail()
  readonly email: string;

  readonly telefoneCelular: string;

  readonly categoria: string;

  @IsNotEmpty()
  readonly senha: string;
}
