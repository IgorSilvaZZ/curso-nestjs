/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ptBR from 'dayjs/locale/pt-br';

import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';
import { IDesafio } from './interfaces/desafios.interface';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('desafio')
    private readonly desafioModel: Model<IDesafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDTO: CriarDesafioDTO): Promise<IDesafio> {
    // Verificar se realmente o solicitante (jogador) informado existe na base
    await this.jogadoresService.consultarJogadorPeloId(
      criarDesafioDTO.solicitante,
    );

    const jogadorFazParteDesafio = criarDesafioDTO.jogadores.find(
      (jogador) => jogador._id === criarDesafioDTO.solicitante,
    );

    if (!jogadorFazParteDesafio) {
      throw new BadRequestException(
        'O solicitante não faz parte da lista de jogadores!',
      );
    }

    const jogadorCategoria =
      await this.categoriasService.consultarCategoriaPorJogador(
        criarDesafioDTO.solicitante,
      );

    const dataHoraSolicitacao = dayjs(new Date()).locale(ptBR).format();

    const novoDesafio = {
      ...criarDesafioDTO,
      categoria: jogadorCategoria.categoria,
      dataHoraSolicitacao,
      status: IDesafioStatusEnum.PENDENTE,
    };

    const desafioCriado = new this.desafioModel(novoDesafio);

    return await desafioCriado.save();
  }

  async consultarDesafios(): Promise<IDesafio[]> {
    return await this.desafioModel
      .find()
      .populate([{ path: 'jogadores', model: 'jogador' }])
      .exec();
  }

  async consultarDesafiosDeUmJogador(
    idJogador: string,
  ): Promise<IDesafio | null> {
    const jogadorEncontrado = await this.desafioModel
      .findOne({ jogadores: idJogador })
      .exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException('Jogador não contém desafios!');
    }

    return jogadorEncontrado;
  }

  async atualizarDesafio(
    idDesafio: string,
    atualizarDesafioDTO: AtualizarDesafioDTO,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel
      .findOne({ _id: idDesafio })
      .exec();

    if (!desafioEncontrado) {
      throw new NotFoundException('Desafio nao encontrado!');
    }

    await this.desafioModel
      .findOneAndUpdate({ _id: idDesafio }, { $set: atualizarDesafioDTO })
      .exec();
  }

  async deletarDesafio(idDesafio: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel
      .findOne({ _id: idDesafio })
      .exec();

    if (!desafioEncontrado) {
      throw new NotFoundException('Desafio não encontrado!');
    }

    await this.desafioModel
      .findOneAndUpdate(
        { _id: idDesafio },
        { $set: { status: IDesafioStatusEnum.CANCELADO } },
      )
      .exec();
  }
}
