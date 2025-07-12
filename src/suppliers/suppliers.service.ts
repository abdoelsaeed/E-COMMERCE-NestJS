/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-suppliers.dto';
import { UpdateSupplierDto } from './dto/update-suppliers.dto';
import { Model } from 'mongoose';
import { Suppliers } from './interfaces/suppliers.interface';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class SupplierService {
  constructor(
    @Inject('SUPPLIER_MODEL') private supplierModel: Model<Suppliers>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = await this.supplierModel.create(createSupplierDto);
      return {
        data: supplier,
      };
    } catch (err) {
      if (err.code === 11000) return handleMongoError(err);
      return err;
    }
  }

  async findAll() {
    const supplier = await this.supplierModel.find();
    return {
      status: 200,
      length: supplier.length,
      data: supplier,
    };
  }

  async findOne(id: string) {
    try {
      const supplier = await this.supplierModel.findById(id);
      if (!supplier) {
        throw new HttpException(
          {
            status: 400,
            error: `No supplier with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        data: supplier,
      };
    } catch (err) {
      return err;
    }
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    try {
      const supplier = await this.supplierModel
        .findByIdAndUpdate(id, updateSupplierDto, { new: true })
        .select('-__v');
      if (!supplier) {
        throw new HttpException(
          {
            status: 400,
            error: `No supplier with this id [${id}]`,
          },
          400,
        );
      }
      return {
        status: 200,
        message: 'update successfuly',
        data: supplier,
      };
    } catch (err) {
      return err;
    }
  }

  async remove(id: string) {
    const supplier = await this.supplierModel.findByIdAndDelete(id);
    if (!supplier) {
      throw new HttpException(
        {
          status: 400,
          error: `No supplier with this id [${id}]`,
        },
        400,
      );
    }
    return {
      status: 201,
      message: 'Done!',
    };
  }
  catch(err: any) {
    return err;
  }
}
