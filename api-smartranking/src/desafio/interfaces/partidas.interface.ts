/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

import { IJogador } from 'src/jogadores/interfaces/jogador.interface';

export interface IPartida extends Document {
  categoria: string;
  def: string;
  resultado: IResultado[];
  jogadores: IJogador[];
}

export interface IResultado {
  set: string;
}
