/* eslint-disable prettier/prettier */

export interface IPartida {
  desafio: string;
  categoria: string;
  def: string;
  resultado: IResultado[];
  jogadores: string[];
}

export interface IResultado {
  set: string;
}
