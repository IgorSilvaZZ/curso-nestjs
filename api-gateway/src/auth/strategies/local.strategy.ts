/* eslint-disable prettier/prettier */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  private logger = new Logger(LocalStrategy.name);

  async validate(email: string, senha: string) {
    this.logger.log('CAIU NO VALIDATE LOCAL STRATEGY!!');

    const jogador = await this.authService.validarUsuario(email, senha);

    if (!jogador) {
      throw new UnauthorizedException();
    }

    return jogador;
  }
}
