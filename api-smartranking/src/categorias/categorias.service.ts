/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';
import { ICategoria } from './interfaces/categoria.interface';

import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('categoria')
    private readonly categoriaModel: Model<ICategoria>,
    private readonly jogadoresService: JogadoresService,
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

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDTO })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    if (!categoriaEncontrada) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException('Jogador já cadastrado nessa categoria');
    }

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }

  async consultarCategoriaPorJogador(idJogador: string): Promise<ICategoria> {
    const categoriaJogador = await this.categoriaModel
      .findOne({ jogadores: idJogador })
      .exec();

    if (!categoriaJogador) {
      throw new NotFoundException('Jogador atribuido a nenhuma categoria');
    }

    return categoriaJogador;
  }
}
