/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
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
}
