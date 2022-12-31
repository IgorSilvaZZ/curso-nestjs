/* eslint-disable prettier/prettier */

import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class JogadoresValidacaoParametrosPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log(`value: ${value} metadata: ${metadata.type}`);

    // metadata.type => O tipo de parametro passado nesse caso vai ser query

    if (!value) {
      throw new BadRequestException(
        `O valor do parametro ${metadata.type} deve ser informado!`,
      );
    }

    return value;
  }
}
