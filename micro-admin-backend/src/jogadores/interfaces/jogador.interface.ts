/* eslint-disable prettier/prettier */

import { Document, ObjectId } from 'mongoose';

export interface IJogador extends Document {
  /* readonly _id: ObjectId; */
  readonly telefoneCelular: string;
  readonly email: string;
  categoria: string;
  nome: string;
  ranking: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
