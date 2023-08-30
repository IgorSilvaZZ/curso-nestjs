/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'rankings' })
export class Ranking extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  desafio: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  jogador: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  partida: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  categoria: string;

  @Prop()
  evento: string;

  @Prop()
  operacao: string;

  @Prop()
  pontos: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
