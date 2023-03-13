/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

export interface IJogador extends Document {
  readonly telefoneCelular: string;
  readonly email: string;
  nome: string;
  ranking: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
