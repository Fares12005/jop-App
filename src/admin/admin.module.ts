import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CompanyModel } from 'src/DB/models/Company.model';
import { UserModel } from 'src/DB/models/User.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[CompanyModel , UserModel],
  controllers: [AdminController],
  providers: [AdminService , JwtService],
})
export class AdminModule {}
