/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Model } from 'mongoose';
import { Tax } from './interfaces/tax.interface';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class TaxService {
  constructor(@Inject('TAX_MODEL') private taxModel: Model<Tax>) {}
  async createOrUpdate(createTaxDto: CreateTaxDto) {
    try {
      const tax = await this.taxModel.findOne({});
      if(!tax){
      const newtax = await this.taxModel.create(createTaxDto);
      return {
        data: newtax,
      };
      }
      const updateTax = await this.taxModel.findOneAndUpdate({}, createTaxDto,{new:true});
      return {
        data: updateTax,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const tax = await this.taxModel.findOne({});
    if (!tax)
      if (!tax) {
        throw new HttpException(
          {
            status: 400,
            error: `No tax found`,
          },
          400,
        );
      }
    return {
      status: 200,
      data: tax,
    };
  }

  async remove() {
    await this.taxModel.findOneAndUpdate({},{texPrice:0,shippingPrice:0});
  }
  catch(err: any) {
    return err;
  }
}
