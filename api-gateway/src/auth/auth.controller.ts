/* eslint-disable prettier/prettier */

import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('/api/v1')
export class AuthController {
  constructor(private authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return await this.authService.autenticarUsuario(req.user);
  }
}
