/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

import { IJogador } from '../../../src/jogadores/interfaces/jogador.interface';
import { IDesafioStatusEnum } from './desafio-status.enum';
import { IPartida } from './partidas.interface';

export interface IDesafio extends Document {
  dataHoraDesafio: Date;
  status: IDesafioStatusEnum;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: string;
  categoria: string;
  jogadores: IJogador[];
  partida: IPartida;
}
