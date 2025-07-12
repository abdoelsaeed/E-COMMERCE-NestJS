/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Model } from 'mongoose';
import { Brand } from './interfaces/brand.interface';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class BrandService {
  constructor(@Inject('BRAND_MODEL') private brandModel: Model<Brand>){

  }
  async create(createBrandDto: CreateBrandDto) {
    try{
    const brand = await this.brandModel.create(createBrandDto);
    return {
      data: brand,
    };
    }
    catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
}

  async findAll() {
    const brands = await this.brandModel.find();
    return {
      status: 200,
      length: brands.length,
      data: brands,
    };
  }

  async findOne(id: string) {
    try{
    const brand = await this.brandModel.findById(id);
    if(!brand){
      throw new HttpException(
        {
          status: 400,
          error: `No category with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 200,
      data: brand
    };
    }
    catch(err){
      return err;
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.brandModel
        .findByIdAndUpdate(id, updateBrandDto,{new:true})
        .select('-__v');
      if (!brand) {
        throw new HttpException(
          {
            status: 400,
            error: `No category with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        message:'update successfuly',
        data: brand,
      };
    } catch (err) {
      return err;
    }    
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);
      if (!brand) {
        throw new HttpException(
          {
            status: 400,
            error: `No category with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 201,
        message:'Done!',
        
      };
    } catch (err) {
      return err;
    }    
  
}
