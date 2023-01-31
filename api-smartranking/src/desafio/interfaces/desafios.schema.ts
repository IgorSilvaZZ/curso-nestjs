/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IJogador } from 'src/jogadores/interfaces/jogador.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.schema';
import { IDesafioStatusEnum } from './desafio-status.enum';
import { IPartida } from './partidas.interface';
import { Partida } from './partidas.schema';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Jogador.name })
  solicitante: IJogador;

  @Prop()
  categoria: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Jogador.name }] })
  jogadores: IJogador[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Partida.name })
  partida: IPartida;
}

export const DesafiosSchema = SchemaFactory.createForClass(Desafio);
