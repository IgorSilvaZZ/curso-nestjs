/* eslint-disable prettier/prettier */

import { ICategoria } from './categoria.interface';

export interface IJogador {
  readonly telefoneCelular: string;
  readonly email: string;
  categoria: ICategoria;
  nome: string;
  ranking: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
