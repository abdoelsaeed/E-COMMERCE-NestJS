/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Model } from 'mongoose';
import {SubCategory} from './interfaces/SubCategory.interface'
import { Category } from 'src/category/interfaces/category.interface';
import { handleMongoError } from 'src/error/handleMongoError';
import { handleCastError } from 'src/error/handleCastErrorID';
@Injectable()
export class SubCategoryService {
  constructor(
    @Inject('SubCATEGORY_MODEL') private subCategoryModel: Model<SubCategory>,
    @Inject('CATEGORY_MODEL') private categoryModel: Model<Category>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!category) {
      throw new HttpException(
        {
          status: 400,
          error: `No category with this id [${createSubCategoryDto.category}]`,
        },
        400,
      );
    }
    try {
      const subCategory =
        await this.subCategoryModel.create(createSubCategoryDto);
      return {
        data: subCategory,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const subCategory = await this.subCategoryModel
      .find()
      .populate({ path: 'category', select: '-_id -__v' });

    return {
      status: 200,
      length: subCategory.length,
      data: subCategory,
    };
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findById(id).select('-__v');
    if (!subCategory) {
      throw new HttpException(`No Sub-Category with this id [${id}]`, 400);
    }
    return {
      status: 200,
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    try{
    const subCategory = await this.subCategoryModel.findByIdAndUpdate(
      id,
      updateSubCategoryDto,{
        new:true
      }
    ); 
    if (!subCategory) {
      throw new HttpException(`No Sub-Category with this id [${id}]`, 400);
    }
    return {
      status: 200,
      data: subCategory,
    };
  }
    catch(err){
      console.log(err)
      if (err.name === 'CastError') {return handleCastError(err);}
      throw err;    }
  }

  async remove(id: string) {
    const subcategory = await this.subCategoryModel.findByIdAndDelete(id);
    if (!subcategory) {
      throw new HttpException(
        {
          status: 400,
          error: `No subcategory with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 201,
      message: 'subcategory removed successfully',
    };
  }
  }
