/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ICategoria } from './interfaces/categorias/categoria.interface';
import { IJogador } from './interfaces/jogadores/jogador.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('jogador') private readonly jogadorModel: Model<IJogador>,
    @InjectModel('categoria')
    private readonly categoriaModel: Model<ICategoria>,
  ) {}

  async criarCategoria(categoria: ICategoria): Promise<ICategoria> {
    try {
      const categoriaCriada = new this.categoriaModel(categoria);

      return await categoriaCriada.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
