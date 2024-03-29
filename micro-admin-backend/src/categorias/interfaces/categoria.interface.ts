/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

export interface ICategoria extends Document {
  readonly _id: string;
  readonly categoria: string;
  descricao: string;
  eventos: IEvento[];
}

export interface IEvento {
  nome: string;
  operacao: string;
  valor: number;
}
