/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  private logger = new Logger(LocalStrategy.name);

  async validate(email: string, senha: string) {
    return await this.authService.validarUsuario({ email, senha });
  }
}
