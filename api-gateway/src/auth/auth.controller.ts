/* eslint-disable prettier/prettier */

import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post()
  async autenticarUsuario(
    /* @Body() authLoginUsuarioDTO: AuthLoginUsuarioDTO */ @Request() req,
  ) {
    /* const { jogador, token } = await this.authService.autenticarUsuario(
      authLoginUsuarioDTO,
    ); */

    return req.user;

    /* this.logger.log(req);
    return await this.authService.autenticarUsuario(req); */
  }
}
