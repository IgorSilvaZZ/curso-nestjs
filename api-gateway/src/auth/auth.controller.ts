/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  async autenticarUsuario({ email, senha }: AuthLoginUsuarioDTO) {
    console.log(email, senha);
  }
}
