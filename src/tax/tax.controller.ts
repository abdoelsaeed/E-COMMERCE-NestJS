/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Post()
  @ApiOperation({ summary: 'Create or update tax', description: 'إضافة أو تحديث الضريبة (للمدير فقط).' })
  @ApiBody({ type: CreateTaxDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء أو تحديث الضريبة بنجاح.' })
  create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdate(createTaxDto);
  }

  @Roles(['Admin'])
  @Get()
  @ApiOperation({ summary: 'Get all taxes', description: 'جلب جميع الضرائب (للمدير فقط).' })
  @ApiResponse({ status: 200, description: 'تم جلب الضرائب.' })
  findAll() {
    return this.taxService.findAll();
  }
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @Delete()
  @ApiOperation({ summary: 'Delete all taxes', description: 'حذف جميع الضرائب (للمدير فقط).' })
  @ApiResponse({ status: 200, description: 'تم حذف الضرائب.' })
  remove() {
    return this.taxService.remove();
  }
}
