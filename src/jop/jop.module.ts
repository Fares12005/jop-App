import { Module } from '@nestjs/common';
import { JopService } from './jop.service';
import { JopController } from './jop.controller';
import { CompanyModel } from 'src/DB/models/Company.model';
import { UserModel } from 'src/DB/models/User.model';
import { JwtService } from '@nestjs/jwt';
import { JobModel } from 'src/DB/models/Job.model';

@Module({
  imports: [CompanyModel , UserModel , JobModel],
  controllers: [JopController],
  providers: [JopService , JwtService],
})
export class JopModule {}
