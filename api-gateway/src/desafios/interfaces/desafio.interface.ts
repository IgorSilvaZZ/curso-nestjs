/* eslint-disable prettier/prettier */

import { IJogador } from '../../jogadores/interfaces/jogador.interface';
import { IDesafioStatusEnum } from './desafio-status.enum';

export interface IDesafio {
  _id: string;
  dataHoraDesafio: Date;
  status: IDesafioStatusEnum;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: string;
  categoria: string;
  /* partida?: string; */
  jogadores: IJogador[];
}
