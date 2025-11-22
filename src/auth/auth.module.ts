import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/User.model';
import { OtpModel } from 'src/DB/models/Otp.model';

@Module({
  imports: [UserModel , OtpModel],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
