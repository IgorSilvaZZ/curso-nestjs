/* eslint-disable prettier/prettier */

import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CriaCategoriaDTO {
  @IsString()
  @IsNotEmpty()
  readonly categoria: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: [
    {
      nome: string;
      operacao: string;
      valor: number;
    },
  ];
}
