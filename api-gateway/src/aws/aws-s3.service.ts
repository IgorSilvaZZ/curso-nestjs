/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAwsService } from 'nest-aws-sdk';

import { S3 } from 'aws-sdk';
@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  public async uploadArquivo(file: any, id: string) {
    try {
      const fileExtension = file.originalname.split('.').pop();

      const urlKey = `${id}.${fileExtension}`;

      const AWS_S3_BUCKET_NAME =
        this.configService.get<string>('AWS_S3_BUCKET_NAME');

      const AWS_S3_URL_ENDPOINT = this.configService.get<string>(
        'AWS_S3_URL_ENDPOINT',
      );

      const params = {
        Body: file.buffer,
        Bucket: AWS_S3_BUCKET_NAME,
        Key: urlKey,
      };

      this.logger.log(`urlKey: ${urlKey}`);

      await this.s3.putObject(params).promise();

      return { url: `${AWS_S3_URL_ENDPOINT}/${AWS_S3_BUCKET_NAME}/${urlKey}` };
    } catch (error) {
      this.logger.error(error.message);
      throw error.message;
    }
  }
}
