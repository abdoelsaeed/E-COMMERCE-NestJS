/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/guard/user.decorator';
import { AuthGuard } from '../guard/Auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create category', description: 'إضافة تصنيف جديد (للمدير فقط).' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء التصنيف بنجاح.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories', description: 'جلب جميع التصنيفات.' })
  @ApiResponse({ status: 200, description: 'تم جلب التصنيفات.' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id', description: 'جلب تصنيف بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب التصنيف.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update category', description: 'تحديث بيانات تصنيف (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف (MongoId)' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'تم تحديث التصنيف.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category', description: 'حذف تصنيف (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف التصنيف (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف التصنيف.' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
