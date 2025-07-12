/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { requestProductService } from './requestProduct.service';
import { CreateRequestProductDto } from './dto/create-requestProduct.dto';
import { UpdateRequestProductDto } from './dto/update-requestProduct.dto';
import { Roles } from 'src/guard/user.decorator';
import { AuthGuard } from '../guard/Auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('RequestProduct')
@ApiBearerAuth()
@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: requestProductService) {}

  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Post()
  @ApiOperation({ summary: 'Create request product', description: 'إرسال طلب منتج جديد (للمستخدم).' })
  @ApiBody({ type: CreateRequestProductDto })
  @ApiResponse({ status: 201, description: 'تم إرسال الطلب بنجاح.' })
  create(
    @Body() createRequestProductDto: CreateRequestProductDto,
    @Req() req: any,
  ) {
    return this.requestProductService.create(createRequestProductDto, req);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Get()
  @ApiOperation({ summary: 'Get all request products', description: 'جلب جميع طلبات المنتجات (للمدير فقط).' })
  @ApiResponse({ status: 200, description: 'تم جلب الطلبات.' })
  findAll() {
    return this.requestProductService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin', 'User'])
  @Get(':id')
  @ApiOperation({ summary: 'Get request product by id', description: 'جلب طلب منتج بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب الطلب.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.requestProductService.findOne(id, req);
  }
  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update request product', description: 'تحديث طلب منتج (للمستخدم).' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiBody({ type: UpdateRequestProductDto })
  @ApiResponse({ status: 200, description: 'تم تحديث الطلب.' })
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @Req() req:any,
  ) {
    return this.requestProductService.update(id,updateRequestProductDto, req);
  }
  @UseGuards(AuthGuard)
  @Roles(['User'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete request product', description: 'حذف طلب منتج (للمستخدم).' })
  @ApiParam({ name: 'id', description: 'معرف الطلب (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف الطلب.' })
  remove(@Param('id') id: string,@Req() req:any,) {
    return this.requestProductService.remove(id,req);
  }
}
