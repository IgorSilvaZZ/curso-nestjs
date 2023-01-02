/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IJogador } from 'src/jogadores/interfaces/jogador.interface';
import { IEvento } from './categoria.interface';

@Schema({ timestamps: true, collection: 'categorias' })
export class Categoria {
  @Prop({ unique: true })
  categoria: string;

  @Prop()
  descricao: string;

  @Prop()
  eventos: IEvento[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador' })
  jogadores: IJogador[];
}

export const CategoriasSchema = SchemaFactory.createForClass(Categoria);
