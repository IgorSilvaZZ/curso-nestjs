/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/auth.constants';
import { ProxyRMQModule } from '../proxymq/proxymq.module';

@Module({
  imports: [
    JwtModule.register({
      global: jwtConstants.options.global,
      secret: jwtConstants.options.secret,
      signOptions: { expiresIn: jwtConstants.options.signOptions.expiresIn },
    }),
    ProxyRMQModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
