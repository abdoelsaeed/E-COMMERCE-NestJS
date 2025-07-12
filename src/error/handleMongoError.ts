/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException } from '@nestjs/common';

export function handleMongoError(err: any): void {
  if (err.code === 11000) {
    const keyValue = Object.keys(err.keyValue)[0];
    
    throw new HttpException(
      {
        status: 409,
        error: `${keyValue} is a unique value`,
      },
      409,
    );
  }
  throw err;
}
