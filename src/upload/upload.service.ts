import { Injectable, Inject } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

type Cloudinary = typeof cloudinary;

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') 
    private cloudinary:Cloudinary) {}

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
          const uploadStream = this.cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if (error || !result) return reject(error || new Error('Upload failed'));
              resolve(result);
            }
          );
    
          uploadStream.end(file.buffer);
        });
      }
}
