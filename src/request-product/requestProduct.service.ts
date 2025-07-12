/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-requestProduct.dto';
import { UpdateRequestProductDto } from './dto/update-requestProduct.dto';
import { Model } from 'mongoose';
import { RequestProduct } from './interfaces/requestProduct.interface';
import { Users } from 'src/user/interfaces/user.interface';

@Injectable()
export class requestProductService {
  constructor(
    @Inject('REQUESTPRODUCT_MODEL')
    private requestProductModel: Model<RequestProduct>,
    @Inject('USERS_MODEL')
    private usersModel: Model<Users>,
  ) {}
  async create(createrequestProductDto: CreateRequestProductDto, req: any) {
    try {
      const userId = req.user._id;
      
      const existingRequest = await this.requestProductModel.findOne({
        user: userId,
        titleNeed: createrequestProductDto.titleNeed,
      });
      if (existingRequest) {
        throw new HttpException(
          {
            status: 400,
            error: `this user created this titleNeed( ${createrequestProductDto.titleNeed} ) recently`,
          },
          400,
        );
      }
      const requestProduct = await this.requestProductModel.create({
        ...createrequestProductDto,
        user:userId
      });
      return {
        data: requestProduct,
      };
    } catch (err) {

      return err;
    }
  }

  async findAll() {
    const requestProduct = await this.requestProductModel
      .find()
      .populate({ path: 'user', select: 'name' });
    return {
      status: 200,
      length: requestProduct.length,
      data: requestProduct,
    };
  }

  async findOne(id: string,req:any) {
    const userId = req.user._id;
    
    const requestProduct = await (await this.requestProductModel.findById(id))?.populate({path:'user',select:'name'})
    console.log('requestProduct:', requestProduct);
    
    if (!requestProduct) {
      throw new HttpException(
        {
          status: 400,
          error: `No requestProduct with this id [${id}]`,
        },
        400,
      );
    }
    
    if (requestProduct?.user._id.toString() !== userId.toString()&&
        req.user.role!=='Admin'
    ){
      throw new UnauthorizedException(
        'You are neither an admin nor the user who created this product request',
      );
    }
    return {
      status: 200,
      message:'Request Product found',
      data: requestProduct,
    };
  }

  async update(id: string, updaterequestProductDto: UpdateRequestProductDto,req:any) {
    const user = req.user._id;
    const requestProduct = await this.requestProductModel.findOneAndUpdate(
      { user, _id: id },
      updaterequestProductDto,
      { new: true },
    );
    if (!requestProduct) {
      throw new HttpException(
        {
          status: 400,
          error: `No requestProduct with this id [${id}] or you are not owner the request product`,
        },
        400,
      );
    }
    return {
      status: 200,
      message: 'requestProduct updated successfully',
      data: requestProduct,
    };
  }

  async remove(id: string,req:any) {
    const user = req.user._id;

    const requestProduct = await this.requestProductModel.findByIdAndDelete({
      user,
      _id: id,
    });
    if (!requestProduct) {
      throw new HttpException(
        {
          status: 400,
          error: `No requestProduct with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 201,
      message: 'requestProduct removed successfully',
    };
  }
}
