/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from 'src/user/interfaces/user.interface';
import {CreateAuthDto, SignInDto} from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { handleMongoError } from 'src/error/handleMongoError';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_MODEL')
    private readonly usersModel: Model<Users>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try{
    const user = await this.usersModel.create({...createAuthDto,role:'User'})
    const { password, ...userWithoutPassword } = user.toObject();
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: token,
      status: 200,
      message: 'User created successfully',
      data: userWithoutPassword,
    };
  }
  catch(err){
      if (err.code === 11000) return handleMongoError(err);
      return err;
  }
  }

  async login(signInDto: SignInDto) {
    const user: any = await this.usersModel
      .findOne({ email: signInDto.email })
      .select('+password');

    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        {
          status: 404,
          error: 'Email or Password is uncorrect',
        },
        404,
      );
    }
    const { password, ...userWithoutPassword } = user._doc;
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: token,
      status: 200,
      data: userWithoutPassword,
    };
  }

  async forgetPassword(email: ForgetPasswordDto) {
    const user = await this.usersModel.find(email);
    if (!user) {
      throw new HttpException(
        {
          status: 404,
          error: 'User not found',
        },
        404,
      );
    }
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    const htmlMessage = `<h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
    <p>Use the following code to Verify your accountL <h1 style="color:#0866ff;font-weight:bold;text-align:center">${code}</h1></p>
    <h6 style="font-weight:bold">E-commerceNestJS</h6>
    `;
    await this.mailService.sendMail({
      from: 'E-commerce NestJS <abdoelsaeed290@gmail.com>',
      to: email.email,
      subject: 'Reset Password',
      html: htmlMessage,
    });
    const hashedCode = await bcrypt.hash(code, 10);
    console.log('hashedCode:', hashedCode);
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // الكود صالح لمدة 10 دقائق
    await this.usersModel.findOneAndUpdate(
      { email: email.email },
      { verification_Code: hashedCode, codeExpiresAt: expiresAt },
    );
    return {
      status: 200,
      message: `Code sent successfully on your email < ${email.email} >`,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, verification_Code, newPassword } = resetPasswordDto;
    const user = await this.usersModel
      .findOne({ email })
      .select('+verification_Code +codeExpiresAt +password');

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (!user.codeExpiresAt) {
      throw new HttpException(
        'Verification code expiration date is missing',
        400,
      );
    }
    if (new Date() > user.codeExpiresAt) {
      throw new HttpException('Verification code has expired', 400);
    }
    if (!user.verification_Code) {
      throw new HttpException('Verification code is missing', 400);
    }
    const isCodeValid = await bcrypt.compare(
      verification_Code,
      user.verification_Code,
    );
    if (!isCodeValid) {
      throw new HttpException('Invalid verification code', 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verification_Code = undefined;
    user.codeExpiresAt = undefined;
    await user.save({validateBeforeSave:false});
    return {
      status: 200,
      message: 'Password reset successfully',
    };
  }
}