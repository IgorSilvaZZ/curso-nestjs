/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

export interface IPartida extends Document {
  desafio: string;
  categoria: string;
  def: string;
  resultado: IResultado[];
  jogadores: string[];
}

export interface IResultado {
  set: string;
}
