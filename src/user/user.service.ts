/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {  HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_MODEL')
    private usersModel: Model<Users>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const userObject = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role:createUserDto.role || 'User',
      age: createUserDto.age,
      phone_number: createUserDto.phone_number,
      address: createUserDto.address,
      active: createUserDto.active,
      verification_Code: createUserDto.verification_Code,
    };
  
    try{
    const user = await this.usersModel.create(userObject)
    const { password, ...userWithoutPassword } = user.toObject();
    return {
      status: 200,
      message: 'User created successfully',
      data: userWithoutPassword,
    };
    }
    catch(err:any){
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }

  }

  async findAll(query) {
    const {
      _limit = 1000_000_00,
      skip = 0,
      sort = 'asc',
      name,
      email,
      role,
    } = query;
    const filter: any = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (email) filter.email = new RegExp(email, 'i');
    if (role) filter.role = new RegExp(role, 'i');
    if (Number.isNaN(Number(+_limit)) || Number.isNaN(Number(skip))) {
      throw new HttpException(
        {
          status: 400,
          error: 'limit and skip should be numbers',
        },
        400,
      );
    }
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException(
        {
          status: 400,
          error: 'sort should be asc or desc',
        },
        400,
      );
    }

    //or => where by all keywards but RegExp => where by any keyward. هتجبلك اي حاجة فيها الاسم حتي لو مش كاملregهتجبلك اللي مطابق للاسم تمام انما الorباختصار ال
    const users = await this.usersModel
      .find(filter)
      .select('-__v')
      .skip(skip)
      .limit(_limit)
      //لو ببحث عن كلمه abdo
      // .or[{name}, { email }, { role }] =لازم اكتب abdo بالظبط
      // .where('name', new RegExp(name, 'i'))عادي اكتب ab بس
      // .where('email', new RegExp(email, 'i'))
      // .where('role', new RegExp(role, 'i'))
      .sort({ name: sort })
      .select('-__v');
    if (!users) {
      throw new HttpException(
        {
          status: 404,
          error: 'No users found',
        },
        404,
      );
    }
    return {
      status: 200,
      message: 'Users found successfully',
      length: users.length,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.usersModel.findById(id).select('-__v');
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    return {
      status: 200,
      message: 'User found successfully',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    return {
      status: 200,
      message: 'User update successfully',
      data: user,
    };
  }

  async delete(id: string) {
    const user = await this.usersModel.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    return {
      status: 204,
      message: 'Done',
    };
  }

  async getMe(payload) {
    const userId = payload._id;
    if (!userId) {
      throw new HttpException(
        {
          status: 401,
          error: 'User not found',
        },
        401,
      );
    }
    const user = await this.usersModel.findById(userId).select('-__v');
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    return {
      status: 200,
      message: 'User found successfully',
      data: user,
    };
  }

  async updateMe(payload, body: UpdateUserDto) {
    const userId = payload._id;
    if (!userId) {
      throw new HttpException(
        {
          status: 401,
          error: 'User not found',
        },
        401,
      );
    }
    const user = await this.usersModel.findByIdAndUpdate(userId, body, {
      new: true,
    });
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    return {
      status: 200,
      message: 'User update successfully',
      data: user,
    };
  }

  async deleteMe(payload) {
    const userId = payload._id;
    if (!userId) {
      throw new HttpException(
        {
          status: 401,
          error: 'User not found',
        },
        401,
      );
    }
    const user = await this.usersModel.findByIdAndUpdate(userId,{active: false}, { new: true});
    if(!user) {
      throw new HttpException(
        {
          status: 401,
          error: 'this user is not active',
        },
        401,
      );
    }
    return {
      status: 204,
      message: 'Done',
    };
  }
}

