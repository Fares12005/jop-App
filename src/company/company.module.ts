import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyModel } from 'src/DB/models/Company.model';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/User.model';

@Module({
  imports : [CompanyModel , UserModel],
  controllers: [CompanyController],
  providers: [CompanyService  , JwtService],
})
export class CompanyModule {}
