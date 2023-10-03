/* eslint-disable prettier/prettier */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConstants } from './constants/auth.constants';

import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.options.secret,
    });
  }

  private logger = new Logger(JwtStrategy.name);

  async validate(payload: any) {
    this.logger.log('CAIU NO VALIDATE!!');

    const { jogador, token } = await this.authService.validarUsuario(
      payload.sub.email,
      payload.sub.senha,
    );

    if (!jogador) {
      throw new UnauthorizedException();
    }

    return { jogador, token };
  }
}
