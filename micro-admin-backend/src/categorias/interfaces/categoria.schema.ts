/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IEvento } from './categoria.interface';

@Schema({ timestamps: true, collection: 'categorias' })
export class Categoria {
  @Prop({ unique: true })
  categoria: string;

  @Prop()
  descricao: string;

  @Prop()
  eventos: IEvento[];
}

export const CategoriasSchema = SchemaFactory.createForClass(Categoria);
