/* eslint-disable prettier/prettier */
export interface IJogador {
  readonly _id: string;
  readonly telefoneCelular: string;
  readonly email: string;
  readonly senha: string;
  categoria: string;
  nome: string;
  ranking: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
