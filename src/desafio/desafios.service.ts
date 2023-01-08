/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';
import { IDesafio } from './interfaces/desafios.interface';

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
    const jogadorEncontrado =
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

    const novoDesafio = {
      ...criarDesafioDTO,
      categoria: jogadorCategoria.categoria,
      dataHoraSolicitacao: new Date(),
      status: IDesafioStatusEnum.PENDENTE,
    };

    const desafioCriado = new this.desafioModel(novoDesafio);

    return await desafioCriado.save();
  }
}
