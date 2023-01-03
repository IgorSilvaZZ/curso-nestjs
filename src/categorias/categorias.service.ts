/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';
import { ICategoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('categoria')
    private readonly categoriaModel: Model<ICategoria>,
  ) {}

  async criarCategoria(
    criarCategoriaDTO: CriaCategoriaDTO,
  ): Promise<ICategoria> {
    const { categoria } = criarCategoriaDTO;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDTO);

    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<ICategoria[]> {
    return await this.categoriaModel.find().exec();
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
