/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { handleMongoError } from 'src/error/handleMongoError';
import { Category } from 'src/category/interfaces/category.interface';
import { SubCategory } from 'src/sub-category/interfaces/SubCategory.interface';
import { Brand } from 'src/brand/interfaces/brand.interface';
import * as qs from 'qs';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_MODEL') private productModel: Model<Product>,
    @Inject('CATEGORY_MODEL') private categoryModel: Model<Category>,
    @Inject('SubCATEGORY_MODEL') private subCategoryModel: Model<SubCategory>,
    @Inject('BRAND_MODEL') private brandModel: Model<Brand>,
  ) {}
  async create(createProductDto: CreateProductDto) {
  
    try {
      
      const category = await this.categoryModel.findById(
        createProductDto.category,
      );
      if (!category) {
        throw new HttpException(
          {
            status: 400,
            error: `No category with this id [${createProductDto.category}]`,
          },
          400,
        );
      }
      if (createProductDto.subCategory) {
        const subCategory = await this.subCategoryModel.findById(
          createProductDto.subCategory,
        );
        if (!subCategory) {
          throw new HttpException(
            {
              status: 400,
              error: `No subCategory with this id [${createProductDto.subCategory}]`,
            },
            400,
          );
        }
      }

      if (createProductDto.brand) {
        const brand = await this.brandModel.findById(
          createProductDto.brand,
        );
        if (!brand) {
          throw new HttpException(
            {
              status: 400,
              error: `No brand with this id [${createProductDto.subCategory}]`,
            },
            400,
          );
        }
      }

      const product = await this.productModel.create(createProductDto);
      return {
        data: product,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll(query:any) {
    //filter
    let requestQuery = { ...query };
    
    requestQuery = qs.parse(requestQuery);
    
    const removeQuery = ['page', 'limit', 'sort', 'keyword', 'category','fields'];
    removeQuery.forEach((singleQuery) => {
      delete requestQuery[singleQuery];
    });
    //replace any gte|lte|le|gt to $gte|$lte|$le|$gt
    requestQuery = JSON.stringify(requestQuery).replace(
      /\b(gte|lte|le|gt)\b/g,
      (match) => `$${match}`,
    );
    requestQuery = JSON.parse(requestQuery);

    //pagenation
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page-1)*limit;

    //sorting
    let sort = query?.sort || 'title';
    const sortFields = sort.split(','); // ممكن يكون 'price,-sold'

    // نحولها لكائن واحد مثلاً { price: 1, sold: -1 }
    const sortObj = {};
    sortFields.forEach((field) => {
      if (field.startsWith('-')) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });


    //fields
    let fields = query?.fields || '';
    fields = fields.split(',').join(' ');
    
    //search
    let findData = { ...requestQuery };
    if(query.keyword){
      findData.$or=[
        {title:{$regax:query.keyword}},
        {description:{$regax:query.keyword}}
      ];
    }
    if(query.category){
      findData.category=query.category.toString();
    }    
    
    
    const products = await this.productModel
    .find(findData)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select(fields);

    return {
      status: 200,
      length: products.length,
      data:products
    };
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel
        .findById(id)
        .populate('category brand subCategory');
      if (!product) {
        throw new HttpException(
          {
            status: 400,
            error: `No product with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        data: product,
      };
    } catch (err) {
      return err;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      if (updateProductDto.category){
        const category = await this.categoryModel.findById(
          updateProductDto.category,
        );
        if (!category) {
          throw new HttpException(
            {
              status: 400,
              error: `No category with this id [${id}]`,
            },
            400,
          );
        }
      }
      if (updateProductDto.brand) {
        const brand = await this.brandModel.findById(updateProductDto.brand);
        if (!brand) {
          throw new HttpException(
            {
              status: 400,
              error: `No brand with this id [${id}]`,
            },
            400,
          );
        }
      }
      if (updateProductDto.subCategory) {
        const subCategory = await this.subCategoryModel.findById(
          updateProductDto.subCategory,
        );
        if (!subCategory) {
          throw new HttpException(
            {
              status: 400,
              error: `No subCategory with this id [${id}]`,
            },
            400,
          );
        }
      }
      const product = await this.productModel.findById(id).select('-__v');
      if (!product) {
        throw new HttpException(
          {
            status: 400,
            error: `No product with this id [${id}]`,
          },
          400,
        );
      }
      if(product.quantity<(updateProductDto.sold??0) ){
        throw new HttpException(
          {
            status: 400,
            error: `quantity must be bigger than sold`,
          },
          400,
        );
      }
      await product.updateOne(updateProductDto);
      return {
        status: 200,
        message: 'update successfuly',
      };
    } catch (err) {
      return err;
    }
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new HttpException(
        {
          status: 400,
          error: `No product with this id [${id}]`,
        },
        400,
      );
    }
    
  }
  catch(err: any) {
    return err;
  }
}

