/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/auth.constants';
import { ProxyRMQModule } from '../proxymq/proxymq.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: jwtConstants.options.global,
      secret: jwtConstants.options.secret,
      signOptions: { expiresIn: jwtConstants.options.signOptions.expiresIn },
    }),
    ProxyRMQModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
