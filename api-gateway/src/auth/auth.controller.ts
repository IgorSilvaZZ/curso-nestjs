/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { compare } from 'bcrypt';

import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(AuthController.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  @Post()
  async autenticarUsuario(@Body() authLoginUsuarioDTO: AuthLoginUsuarioDTO) {
    this.logger.log(authLoginUsuarioDTO);

    const jogador = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-jogador-email',
        authLoginUsuarioDTO.email,
      ),
    );

    this.logger.log(jogador);

    if (!jogador) {
      throw new UnauthorizedException('Email/Password Incorrect');
    }

    if (!(await compare(authLoginUsuarioDTO.senha, jogador.senha))) {
      throw new UnauthorizedException('Email/Password Incorrect');
    }

    const token = await this.jwtService.signAsync({ sub: jogador.id });

    return { jogador, token };
  }
}
