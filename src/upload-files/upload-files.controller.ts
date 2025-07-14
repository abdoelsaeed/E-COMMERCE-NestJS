/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment *//* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 50000,
            message: `File is to large must be less than 50kbs`,
          }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const image = await this.cloudinaryService.uploadFile(file);
    const url = image.url;
    return { url };
  }
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file', 5))
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const images = await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinaryService.uploadFile(file);
        return result.url;
      }),
    );
    return images;
  }
}
