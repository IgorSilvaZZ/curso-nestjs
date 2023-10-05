/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

import { Categoria } from '../../categorias/interfaces/categoria.schema';

export interface IJogador extends Document {
  /* readonly _id: ObjectId; */
  readonly telefoneCelular: string;
  readonly email: string;
  readonly senha: string;
  categoria: Categoria;
  nome: string;
  ranking: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
