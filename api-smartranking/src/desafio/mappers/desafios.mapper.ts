/* eslint-disable prettier/prettier */

import { IDesafio } from '../interfaces/desafios.interface';

export function mapperDesafioToDomain(desafio: IDesafio) {
  return {
    _id: desafio._id,
    categoria: desafio.categoria,
    status: desafio.status,
    dataHoraSolicitacao: desafio.dataHoraSolicitacao,
    dataHoraDesafio: desafio.dataHoraDesafio,
    jogadores: desafio.jogadores,
  };
}
