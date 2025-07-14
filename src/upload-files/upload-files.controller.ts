/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment *//* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RateLimit } from 'nestjs-rate-limiter';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
@Controller('image')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @Roles(['Admin', 'User'])
  @RateLimit({ points: 3, duration: 3600 })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 50000,
            message: `File is to large must be less than 50kbs`,
          }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
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
  @UseGuards(AuthGuard)
  @Roles(['Admin', 'User'])
  @UseInterceptors(FilesInterceptor('file', 5))
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
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
