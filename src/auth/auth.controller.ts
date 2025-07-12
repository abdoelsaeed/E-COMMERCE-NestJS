/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, SignInDto } from './dto/auth.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up', description: 'تسجيل مستخدم جديد.' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 201, description: 'تم إنشاء الحساب بنجاح.' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'تسجيل الدخول.' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح.' })
  login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Post('forgetpassword')
  @ApiOperation({
    summary: 'Forget password',
    description: 'إرسال رابط إعادة تعيين كلمة المرور.',
  })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'تم إرسال رابط إعادة تعيين كلمة المرور.',
  })
  forgetPassword(@Body() email: ForgetPasswordDto) {
    return this.authService.forgetPassword(email);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // حذف الكوكي عن طريق تعيين تاريخ انتهاء صلاحية في الماضي
    response.clearCookie('token'); // استبدل 'token' باسم الكوكي الذي تستخدمه
    return { message: 'Logged out successfully' };
  }

  @Post('resetpassword')
  @ApiOperation({
    summary: 'Reset password',
    description: 'إعادة تعيين كلمة المرور.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'تم إعادة تعيين كلمة المرور.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
