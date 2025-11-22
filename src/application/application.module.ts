import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { UserModel } from 'src/DB/models/User.model';
import { JobModel } from 'src/DB/models/Job.model';
import { ApplicationModel } from 'src/DB/models/Application .model';
import { JwtService } from '@nestjs/jwt';
import { CompanyModel } from 'src/DB/models/Company.model';
import { SocketGateway } from 'src/Common/Geatway/soket.getway';

@Module({
  imports:[UserModel,JobModel,ApplicationModel,CompanyModel],
  controllers: [ApplicationController],
  providers: [ApplicationService , JwtService , SocketGateway],
})
export class ApplicationModule {}
