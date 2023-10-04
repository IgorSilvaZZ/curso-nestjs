/* eslint-disable prettier/prettier */

import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { compare } from 'bcrypt';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(AuthService.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  async validarUsuario(email: string, senha: string) {
    const jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador-email', email),
    );

    if (!(await compare(senha, jogador.senha))) {
      return null;
    }

    return jogador ?? null;
  }

  async autenticarUsuario(jogador: any) {
    /* const jogador = await this.validarUsuario(
      authLoginUsuarioDTO.email,
      authLoginUsuarioDTO.senha,
    ); */

    const token = await this.jwtService.signAsync({ sub: jogador.id });

    return { token };
  }
}
