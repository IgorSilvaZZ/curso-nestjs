/* eslint-disable prettier/prettier */

import { Body, Controller, Logger, Post } from '@nestjs/common';

import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';
import { AuthService } from './auth.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @Post()
  async autenticarUsuario(@Body() authLoginUsuarioDTO: AuthLoginUsuarioDTO) {
    const { jogador, token } = await this.authService.autenticarUsuario(
      authLoginUsuarioDTO,
    );

    return { jogador, token };
  }
}
