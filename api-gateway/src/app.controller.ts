/* eslint-disable prettier/prettier */

import { Controller, Post, Logger, UsePipes, Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';

import { ClientProxy } from '@nestjs/microservices';
import { ClientProxyFactory } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';

@Controller('api/v1/categorias')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  // Assim fazendo uma conexão com nosso message broker
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDTO: CriaCategoriaDTO) {
    return await this.clientAdminBackend.emit(
      'criar-categoria',
      criarCategoriaDTO,
    );
  }
}
