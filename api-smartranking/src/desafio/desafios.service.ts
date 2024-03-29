/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';
import { IDesafio } from './interfaces/desafios.interface';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuirDesafioPartida.dto';
import { IPartida } from './interfaces/partidas.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('desafio')
    private readonly desafioModel: Model<IDesafio>,
    @InjectModel('partida')
    private readonly partidaModel: Model<IPartida>,
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
        'O solicitante deve ser um jogador da partida!',
      );
    }

    const jogadorCategoria =
      await this.categoriasService.consultarCategoriaPorJogador(
        criarDesafioDTO.solicitante,
      );

    if (!jogadorCategoria) {
      throw new BadRequestException(
        'O solicitante precisa estar registrado em uma categoria!',
      );
    }

    const dataHoraSolicitacao = new Date();

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
      .populate([
        { path: 'solicitante', model: 'jogador' },
        { path: 'jogadores', model: 'jogador' },
        { path: 'partida', model: 'partida' },
      ])
      .exec();
  }

  async consultarDesafiosDeUmJogador(idJogador: string): Promise<IDesafio[]> {
    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    const _id = idJogador;

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in([_id])
      .populate([
        { path: 'solicitante', model: 'jogador' },
        { path: 'jogadores', model: 'jogador' },
        { path: 'partida', model: 'partida' },
      ])
      .exec();
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

    let dataHoraResposta;

    if (atualizarDesafioDTO.status) {
      dataHoraResposta = new Date();
    }

    const desafioAtualizado = {
      ...atualizarDesafioDTO,
      dataHoraDesafio: atualizarDesafioDTO.dataHoraDesafio,
      dataHoraResposta,
    };

    await this.desafioModel
      .findOneAndUpdate({ _id: idDesafio }, { $set: desafioAtualizado })
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

  async atribuirDesafioPartida(
    idDesafio: string,
    atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel
      .findOne({ _id: idDesafio })
      .exec();

    if (!desafioEncontrado) {
      throw new NotFoundException('Desafio não encontrado!');
    }

    const jogadorFazParteDesafio = await this.desafioModel
      .findOne({ jogadores: atribuirDesafioPartidaDTO.def })
      .exec();

    if (!jogadorFazParteDesafio) {
      throw new BadRequestException(
        'O Jogador vencedor não faz parte do desafio!',
      );
    }

    const novaPartida = {
      categoria: desafioEncontrado.categoria,
      def: atribuirDesafioPartidaDTO.def,
      resultado: atribuirDesafioPartidaDTO.resultado,
    };

    const partidaCriada = new this.partidaModel(novaPartida);

    await partidaCriada.save();

    try {
      await this.desafioModel.findOneAndUpdate(
        { _id: idDesafio },
        {
          $set: {
            status: IDesafioStatusEnum.REALIZADO,
            partida: partidaCriada,
          },
        },
      );
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: partidaCriada._id }).exec();

      throw new InternalServerErrorException();
    }
  }
}
