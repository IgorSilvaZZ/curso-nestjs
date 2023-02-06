/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
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

  async consultarCategorias(): Promise<ICategoria[]> {
    return await this.categoriaModel
    .find()
    .populate([{ path: 'jogadores', model: 'jogador' }])
    .exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<ICategoria> {
    const categoriaEncontrada = await this.categoriaModel.findOne({
      _id: categoria,
    });

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return categoriaEncontrada;
  }

}
