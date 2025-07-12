/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SupplierService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-suppliers.dto';
import { UpdateSupplierDto } from './dto/update-suppliers.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Supplier')
@ApiBearerAuth()
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create supplier', description: 'إضافة مورد جديد (للمدير فقط).' })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء المورد بنجاح.' })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin','User'])
  @Get()
  @ApiOperation({ summary: 'Get all suppliers', description: 'جلب جميع الموردين.' })
  @ApiResponse({ status: 200, description: 'تم جلب الموردين.' })
  findAll() {
    return this.supplierService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin','User'])
  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by id', description: 'جلب مورد بواسطة المعرف.' })
  @ApiParam({ name: 'id', description: 'معرف المورد (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب المورد.' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update supplier', description: 'تحديث بيانات مورد (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المورد (MongoId)' })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({ status: 200, description: 'تم تحديث المورد.' })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateCouponDto);
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier', description: 'حذف مورد (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المورد (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف المورد.' })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
