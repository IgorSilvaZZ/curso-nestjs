/* eslint-disable prettier/prettier */

import {
  Controller,
  Post,
  Logger,
  UsePipes,
  Body,
  Query,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Observable } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { ClientProxyFactory } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';

import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';
import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';

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
  criarCategoria(@Body() criarCategoriaDTO: CriaCategoriaDTO) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDTO);
  }

  @Get()
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDTO,
    });
  }
}
