/* eslint-disable prettier/prettier */

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'jogadores' })
export class Jogador {
  @Prop()
  nome: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  telefoneCelular: string;

  @Prop()
  ranking: string;

  @Prop()
  posicaoRanking: number;

  @Prop()
  urlFotoJogador: string;
}

export const JogadoresSchema = SchemaFactory.createForClass(Jogador);
