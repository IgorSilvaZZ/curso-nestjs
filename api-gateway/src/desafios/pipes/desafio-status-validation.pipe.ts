/* eslint-disable prettier/prettier */

import { PipeTransform, BadRequestException } from '@nestjs/common';

import { IDesafioStatusEnum } from '../interfaces/desafio-status.enum';

export class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitido = [
    IDesafioStatusEnum.ACEITO,
    IDesafioStatusEnum.NEGADO,
    IDesafioStatusEnum.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusVAlido(status)) {
      throw new BadRequestException(`${status} é um status inválido!`);
    }

    return value;
  }

  private ehStatusVAlido(status: any) {
    const idx = this.statusPermitido.indexOf(status);

    return idx !== -1;
  }
}
