/* eslint-disable prettier/prettier */

import { IJogador } from '../../jogadores/interfaces/jogador.interface';

export interface IPartida {
  categoria?: string;
  desafio?: string;
  def?: IJogador;
  resultado?: IResultado[];
  jogadores?: IJogador[];
}

export interface IResultado {
  set: string;
}
