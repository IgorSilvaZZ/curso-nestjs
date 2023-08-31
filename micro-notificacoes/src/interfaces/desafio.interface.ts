/* eslint-disable prettier/prettier */

import { IDesafioStatusEnum } from './desafio-status.enum';

export interface IDesafio {
  _id: string;
  dataHoraDesafio: Date;
  status: IDesafioStatusEnum;
  dataHoraSolicitacao: Date;
  dataHoraResposta?: Date;
  solicitante: string;
  categoria: string;
  partida?: string;
  jogadores: JogadoresDesafio[];
}

interface JogadoresDesafio {
  _id: string;
}
