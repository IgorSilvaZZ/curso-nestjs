/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Jogador } from '../../jogadores/interfaces/jogador.schema';
import { IResultado } from './partidas.interface';

@Schema({ timestamps: true, collection: 'partidas' })
export class Partida {
  @Prop()
  categoria: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Jogador.name })
  def: Jogador;

  @Prop()
  resultado: IResultado[];
}

export const PartidasSchema = SchemaFactory.createForClass(Partida);
