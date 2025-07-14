/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const image = await this.cloudinaryService.uploadFile(file);
    const url = image.url;
    return {url};
  }
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const images = await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinaryService.uploadFile(file);
        return result.url;
      }),
    );
    return images;
  }
}
