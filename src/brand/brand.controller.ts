/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Brand')
@ApiBearerAuth()
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create brand', description: 'إضافة ماركة جديدة (للمدير فقط).' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء الماركة بنجاح.' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands', description: 'جلب جميع الماركات.' })
  @ApiResponse({ status: 200, description: 'تم جلب الماركات.' })
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by id', description: 'جلب ماركة بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف الماركة (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب الماركة.' })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update brand', description: 'تحديث بيانات ماركة (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الماركة (MongoId)' })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({ status: 200, description: 'تم تحديث الماركة.' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand', description: 'حذف ماركة (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف الماركة (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف الماركة.' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
