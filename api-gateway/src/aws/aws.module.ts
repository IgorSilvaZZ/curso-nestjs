/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, Endpoint } from 'aws-sdk';

import { AwsService } from './aws.service';

@Module({
  imports: [
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        s3ForcePathStyle: true, // Parametro que força urls de estilo caminho para objetos do S3
        endpoint: new Endpoint('http://localhost:4000'),
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
      },
      services: [S3],
    }),
  ],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
