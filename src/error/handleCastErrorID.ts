/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException } from '@nestjs/common';

export function handleCastError(err: any): void {
  if (err.name === 'CastError') {
    
    throw new HttpException(
      {
        status: 409,
        error: `please put a vaild ID`,
      },
      409,
    );
  }
  throw err;
}