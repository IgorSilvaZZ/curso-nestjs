/* eslint-disable prettier/prettier */

import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { IEvento } from '../interfaces/categoria.interface';

export class AtualizarCategoriaDTO {
  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: IEvento[];
}
