/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IResultado } from './partidas.interface';
import { IDesafio } from '../../desafios/interfaces/desafio.interface';
import { Desafio } from '../../desafios/interfaces/desafios.schema';

@Schema({ timestamps: true, collection: 'partidas' })
export class Partida {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Desafio' })
  desafio: IDesafio;

  @Prop()
  categoria: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  def: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  jogadores: string[];

  @Prop()
  resultado: IResultado[];
}

export const PartidasSchema = SchemaFactory.createForClass(Partida);
