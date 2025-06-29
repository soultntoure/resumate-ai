import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk'; // Assuming AWS SDK V2 for simplicity, V3 has @aws-sdk/client-s3
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private readonly s3: S3;
  private readonly s3BucketName: string;
  private readonly logger = new Logger(FilesService.name);

  constructor(private configService: ConfigService) {
    this.s3BucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
    const s3Endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');

    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
      ...(s3Endpoint && { endpoint: s3Endpoint, s3ForcePathStyle: true }), // For MinIO local S3
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    try {
      const uploadResult = await this.s3.upload({
        Bucket: this.s3BucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read', // Or define more restrictive policies
      }).promise();
      this.logger.log(`File uploaded: ${uploadResult.Location}`);
      return uploadResult.Location;
    } catch (error) {
      this.logger.error('Failed to upload file to S3', error.stack);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getFile(fileName: string): Promise<{ stream: Readable; contentType: string }> {
    try {
      const params = {
        Bucket: this.s3BucketName,
        Key: fileName,
      };
      const data = await this.s3.getObject(params).promise();

      if (!data.Body || !data.ContentType) {
        throw new InternalServerErrorException('File content or type missing from S3 response');
      }

      return {
        stream: data.Body as Readable,
        contentType: data.ContentType,
      };
    } catch (error) {
      this.logger.error(`Failed to get file from S3: ${fileName}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve file');
    }
  }
}
