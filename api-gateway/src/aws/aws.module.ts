/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, Endpoint } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => ({
          s3ForcePathStyle: true,
          endpoint: new Endpoint(configService.get('AWS_S3_URL_ENDPOINT')),
          accessKeyId: configService.get('AWS_SECRET_KEY_ID'),
          secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        }),
        inject: [ConfigService],
      },
      services: [S3],
    }),
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
