/* eslint-disable prettier/prettier */

import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IDesafioStatusEnum } from './desafio-status.enum';

@Schema({ timestamps: true, collection: 'desafios' })
export class Desafio {
  @Prop()
  dataHoraDesafio: Date;

  @Prop()
  status: IDesafioStatusEnum;

  @Prop()
  dataHoraSolicitacao: Date;

  @Prop()
  dataHoraResposta: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  solicitante: string;

  @Prop()
  categoria: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  jogadores: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  partida: string;
}

export const DesafiosSchema = SchemaFactory.createForClass(Desafio);
