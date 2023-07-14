/* eslint-disable prettier/prettier */

import { IsNotEmpty } from 'class-validator';
import { IJogador } from '../../jogadores/interfaces/jogador.interface';
import { IResultado } from '../interfaces/partida.interface';

export class AtribuirDesafioPartidaDTO {
  @IsNotEmpty()
  def: IJogador;

  @IsNotEmpty()
  resultado: IResultado[];
}
