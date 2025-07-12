/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create product', description: 'إضافة منتج جديد (للمدير فقط).' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء المنتج بنجاح.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products', description: 'جلب جميع المنتجات مع إمكانية الفلترة.' })
  @ApiResponse({ status: 200, description: 'تم جلب المنتجات.' })
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id', description: 'جلب منتج بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف المنتج (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب المنتج.' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update product', description: 'تحديث بيانات منتج (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المنتج (MongoId)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'تم تحديث المنتج.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product', description: 'حذف منتج (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المنتج (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف المنتج.' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
