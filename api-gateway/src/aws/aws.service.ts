/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';

import { S3 } from 'aws-sdk';
@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  public async uploadArquivo(file: any, id: string) {
    const [, fileExtension] = file.originalname.split('.');

    const urlKey = `${id}.${fileExtension}`;

    const params = {
      Body: file.buffer,
      Bucket: 'smartranking',
      Key: urlKey,
    };

    const data = await this.s3.putObject(params).promise();

    // const data = await this.s3.listBuckets().promise();

    return data;
  }
}
