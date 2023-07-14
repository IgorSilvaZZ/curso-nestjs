/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ICategoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('categoria')
    private readonly categoriaModel: Model<ICategoria>,
  ) {}

  logger = new Logger(CategoriasService.name);

  async criarCategoria(categoria: ICategoria): Promise<ICategoria> {
    try {
      const categoriaCriada = new this.categoriaModel(categoria);

      return await categoriaCriada.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async consultarCategorias(): Promise<ICategoria[]> {
    return await this.categoriaModel.find().exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<ICategoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        _id: categoria,
      })
      .exec();

    return categoriaEncontrada;
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoriaDTO: ICategoria,
  ): Promise<void> {
    await this.categoriaModel
      .findOneAndUpdate({ _id }, { $set: atualizarCategoriaDTO })
      .exec();
  }
}
