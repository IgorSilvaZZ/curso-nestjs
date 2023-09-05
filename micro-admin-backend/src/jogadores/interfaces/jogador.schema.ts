/* eslint-disable prettier/prettier */

import mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { Categoria } from '../../categorias/interfaces/categoria.schema';

@Schema({ timestamps: true, collection: 'jogadores' })
export class Jogador {
  /* @Prop({ _id: false })
  _id: string; */

  @Prop()
  nome: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  senha: string;

  @Prop()
  telefoneCelular: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Categoria.name })
  categoria: Categoria;

  @Prop()
  ranking: string;

  @Prop()
  posicaoRanking: number;

  @Prop()
  urlFotoJogador: string;
}

export const JogadoresSchema = SchemaFactory.createForClass(Jogador);
