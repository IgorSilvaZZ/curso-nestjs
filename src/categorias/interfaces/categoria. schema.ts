/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IJogador } from 'src/jogadores/interfaces/jogador.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.schema';
import { IEvento } from './categoria.interface';

@Schema({ timestamps: true, collection: 'categorias' })
export class Categoria {
  @Prop({ unique: true })
  categoria: string;

  @Prop()
  descricao: string;

  @Prop()
  eventos: IEvento[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Jogador.name }] })
  jogadores: IJogador[];
}

export const CategoriasSchema = SchemaFactory.createForClass(Categoria);
