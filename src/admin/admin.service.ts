import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/DB/models/User.model';
import { Model, Types } from 'mongoose';
import { Company } from 'src/DB/models/Company.model';

@Injectable()
export class AdminService {

  constructor(
    @InjectModel(`User`) private userModel : Model<User>,
    @InjectModel(`Company`) private companyModel : Model<Company>,
  ) {}
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

   async findAll() {

    const users = await this.userModel.find()
    if(!users){
      throw new Error(`Users not found`)
    }

    const companies = await this.companyModel.find()
    if(!companies){
      throw new Error(`Companies not found`)
    }

    return {users , companies}
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

 async updateUser(userId: string , adminId: Types.ObjectId) {

        const admin = await this.userModel.findById(adminId)
    if(!admin){
      throw new Error(`Admin not found`)
    }




    const user = await this.userModel.findById(userId)
    if(!user){
      throw new Error(`User not found`)
    }

    user.bannedAt = new Date()
    user.bannedByAdminAt = adminId

    await user.save()

    return {message : `User banned successfully`}



  }

 async updateCompany(companyId: string , adminId: Types.ObjectId) {

        const admin = await this.userModel.findById(adminId)
    if(!admin){
      throw new Error(`Admin not found`)
    }




    const company = await this.companyModel.findById(companyId)
    if(!company){
      throw new Error(`Company not found`)
    }

    company.bannedAt = new Date()
    company.bannedByAdminAt = adminId

    await company.save()

    return {message : `Company banned successfully`}



  }

  async approveCompany(companyId: string , adminId: Types.ObjectId) {

        const admin = await this.userModel.findById(adminId)
    if(!admin){
      throw new Error(`Admin not found`)
    }



    const company = await this.companyModel.findById(companyId)
    if(!company){
      throw new Error(`Company not found`)
    }

    if(company.bannedAt){
      throw new BadRequestException(`Company banned`)
    }

    company.approved = true
    company.approvedByAdmin = adminId

    await company.save()

    return {message : `Company approved successfully`}


  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
