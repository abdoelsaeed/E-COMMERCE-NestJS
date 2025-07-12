/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('SubCategory')
@ApiBearerAuth()
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create sub-category', description: 'إضافة تصنيف فرعي جديد (للمدير فقط).' })
  @ApiBody({ type: CreateSubCategoryDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء التصنيف الفرعي بنجاح.' })
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sub-categories', description: 'جلب جميع التصنيفات الفرعية.' })
  @ApiResponse({ status: 200, description: 'تم جلب التصنيفات الفرعية.' })
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sub-category by id', description: 'جلب تصنيف فرعي بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف الفرعي (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب التصنيف الفرعي.' })
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update sub-category', description: 'تحديث بيانات تصنيف فرعي (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف الفرعي (MongoId)' })
  @ApiBody({ type: UpdateSubCategoryDto })
  @ApiResponse({ status: 200, description: 'تم تحديث التصنيف الفرعي.' })
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete sub-category', description: 'حذف تصنيف فرعي (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف الفرعي (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف التصنيف الفرعي.' })
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
