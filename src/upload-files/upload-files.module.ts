/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadFilesController],
  providers: [CloudinaryService,CloudinaryProvider],
})
export class UploadFilesModule {}
