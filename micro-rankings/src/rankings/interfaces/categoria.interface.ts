/* eslint-disable prettier/prettier */

export interface ICategoria {
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
