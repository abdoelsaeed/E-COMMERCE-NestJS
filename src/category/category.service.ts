/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_MODEL') private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return {
        data:category,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const categories=await this.categoryModel.find();
    return {
      status:200,
      length:categories.length,
      data:categories
    };
  }

  async findOne(id:string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException(
        {
          status: 400,
          error: `No category with this id [${id}]`,
        },
        400,
      );
    }
    return{    
      status: 200,
      data: category
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
    {
      new:true
    });
    if(!category){
      throw new HttpException(
        {
          status: 400,
          error: `No category with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status:200,
      message: 'Category updated successfully',
      data:category
    }
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
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
      message: 'Category removed successfully',
    };
  }
}
