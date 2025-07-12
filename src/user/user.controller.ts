/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../guard/Auth.guard';
import { Roles } from 'src/guard/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserForController {
  constructor(private readonly userService: UserService) {}
  @Roles(['Admin'])
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create user', description: 'إضافة مستخدم جديد (للمدير فقط).' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح.' })
  createUser(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    return this.userService.createUser(createUserDto);
  }
  //i put Pageination
  @Roles(['Admin'])
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'جلب جميع المستخدمين (للمدير فقط).' })
  @ApiResponse({ status: 200, description: 'تم جلب المستخدمين.' })
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @Roles(['Admin'])
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id', description: 'جلب مستخدم بواسطة المعرف (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم جلب المستخدم.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(['Admin'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user', description: 'تحديث بيانات مستخدم (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم (MongoId)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'تم تحديث المستخدم.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(['Admin'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'حذف مستخدم (للمدير فقط).' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم (MongoId)' })
  @ApiResponse({ status: 200, description: 'تم حذف المستخدم.' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}

@ApiTags('UserMe')
@ApiBearerAuth()
@Controller('userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @Roles(['User', 'Admin'])
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get my profile', description: 'جلب بيانات المستخدم الحالي.' })
  @ApiResponse({ status: 200, description: 'تم جلب بيانات المستخدم.' })
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

  @Roles(['User', 'Admin'])
  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update my profile', description: 'تحديث بيانات المستخدم الحالي.' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'تم تحديث بيانات المستخدم.' })
  updateMe(@Req() req, @Body() body: UpdateUserDto) {
    return this.userService.updateMe(req.user, body);
  }

  @Roles(['User', 'Admin'])
  @UseGuards(AuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete my profile', description: 'حذف حساب المستخدم الحالي.' })
  @ApiResponse({ status: 200, description: 'تم حذف الحساب.' })
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user);
  }
}
