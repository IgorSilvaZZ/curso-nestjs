/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

import { IDesafioStatusEnum } from './desafio-status.enum';

export interface IDesafio extends Document {
  dataHoraDesafio: Date;
  status: IDesafioStatusEnum;
  dataHoraSolicitacao: Date;
  dataHoraResposta?: Date;
  solicitante: string;
  categoria: string;
  partida?: string;
  jogadores: string[];
}
