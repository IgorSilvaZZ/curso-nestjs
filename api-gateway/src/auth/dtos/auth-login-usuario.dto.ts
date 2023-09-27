/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginUsuarioDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;
}
