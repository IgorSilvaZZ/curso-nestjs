/* eslint-disable prettier/prettier */

import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class AtualizarCategoriaDTO {
  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: IEvento[];
}

export interface IEvento {
  nome: string;
  operacao: string;
  valor: number;
}
