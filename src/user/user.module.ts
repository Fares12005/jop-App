import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/User.model';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService , JwtService],
})
export class UserModule {}
