/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  public async uploadArquivo(file: any, id: string) {
    const s3Instance = new AWS.S3({
      endpoint: 'http://localhost:4000',
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
    });

    const [, fileExtension] = file.originalname.split('.');

    const urlKey = `${id}.${fileExtension}`;

    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: 'smartranking',
      Key: urlKey,
    };

    const data = s3Instance
      .putObject(params)
      .promise()
      .then((data) => data);

    return data;
  }
}
