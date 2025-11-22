import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto, UpdateAllCompanyDto, UpdateDataCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from 'src/DB/models/Company.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/models/User.model';
import { s3Uploader } from 'src/Utils/multer/S3.util';
import { file } from 'zod';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel(`Company`) private companyModel : Model<Company>,
    @InjectModel(`User`) private userModel : Model<User>,
    private jwtService : JwtService
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto , ownerId : Types.ObjectId) {
    const {companyName , description , industry ,numberOfEmployees , companyEmail} = createCompanyDto;

    const user = await this.userModel.findById(ownerId)

    if(!user){
      throw new Error(`User not found`)
    }

    const companyExist = await this.companyModel.findOne({companyEmail , companyName})

    if(companyExist){
      throw new Error(`Company with this email or name already exists`)
    }

    const company = await this.companyModel.create({companyName , description , industry ,numberOfEmployees , companyEmail , createdBy : ownerId})

    return {company , message : `Company created successfully`};
   
  }

  async uploadLogo(ownerId : Types.ObjectId , file : Express.Multer.File , companyId : Types.ObjectId ) {

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new Error(`Company not found`)
    }

    const owner = await this.userModel.findById(ownerId)

    if(!owner){
      throw new Error(`Owner not found`)
    }

            const uploadResult = await s3Uploader( file, 'company-logo');
            
            const updatedUser = await this.companyModel.findByIdAndUpdate(
                companyId,
                { logo: uploadResult }, 
                { new: true, runValidators: true } 
            ).exec();
    
            if (!updatedUser) {
                throw new NotFoundException(`Company with ID  not found.`);
            }
    
            return { 
                message: "Profile picture uploaded to S3 and user data updated successfully", 
                data: uploadResult,
                user: updatedUser 
            };

  }

  async uploadCover(ownerId : Types.ObjectId , file : Express.Multer.File , companyId : Types.ObjectId ) {


    const owner = await this.userModel.findById(ownerId)

    if(!owner){
      throw new NotFoundException(`Owner not found`)
    }

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new BadRequestException(`Company not found`)
    }

    

            const uploadResult = await s3Uploader( file, 'company-cover');
            
            const updatedUser = await this.companyModel.findByIdAndUpdate(
                companyId,
                { coverPic: uploadResult }, 
                { new: true, runValidators: true } 
            ).exec();
    
            if (!updatedUser) {
                throw new NotFoundException(`Company with ID  not found.`);
            }
    
            return { 
                message: "Profile picture uploaded to S3 and user data updated successfully", 
                data: uploadResult,
                user: updatedUser 
            };

  }

  async searchCompany(name : string) {

    const company = await this.companyModel.findOne({companyName : name})
    if(!company){
      throw new NotFoundException(`Company not found`)
    }
    return company
  }


  async addHR(hrId : Types.ObjectId , companyId : Types.ObjectId) {

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new NotFoundException(`Company not found`)
    }
    
    const hr = await this.userModel.findById(hrId)

    if(!hr){
      throw new NotFoundException(`HR not found`)
    }

    if (company.HRs.includes(hrId)) {
        throw new BadRequestException(`HR already added to this company`);
    }

    company.HRs.push(hrId)
    await company.save()

    

  



    return { message : `HR added successfully`};
    
   
  }

  async updateData(companyId : Types.ObjectId , ownerId : Types.ObjectId , updateCompanyDto: UpdateDataCompanyDto) {
    const {industry , numberOfEmployees} = updateCompanyDto

    const owner = await this.userModel.findById(ownerId)

    if(!owner){
      throw new BadRequestException(`Owner not found`)
    }

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new NotFoundException(`Company not found`)
    }

    company.industry = industry
    company.numberOfEmployees = numberOfEmployees
    await company.save()
    

   

    return { message : `Company updated successfully`};
   
  }

  async updateAllData(companyId : Types.ObjectId , userId : Types.ObjectId , updateAllCompanyDto: UpdateAllCompanyDto) {
    
    const {companyName , description , industry ,numberOfEmployees , companyEmail} = updateAllCompanyDto

    const user = await this.userModel.findById(userId)

    if(!user){
      throw new BadRequestException(`User not found`)
    }

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new NotFoundException(`Company not found`)
    }

    company.companyName = companyName
    company.description = description
    company.industry = industry
    company.numberOfEmployees = numberOfEmployees
    company.companyEmail = companyEmail
    await company.save()
    

   

    return { message : `Company updated successfully`};
   
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async Softremove(companyId : Types.ObjectId , ownerId : Types.ObjectId) {
    const owner = await this.userModel.findById(ownerId)

    if(!owner){
      throw new BadRequestException(`Owner not found`)
    }

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new  NotFoundException(`Company not found`)
    }

    company.deletedAt = new Date()
    company.IsDeleted = true
    await company.save()

    return { message : `Company removed successfully`};
  }



  async deleteLogo(companyId : Types.ObjectId) {
  

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new NotFoundException(`Company not found`)
    }

    company.logo = null
    await company.save()

    return { message : `Logo deleted successfully`};
  }

  async deleteCover(companyId : Types.ObjectId ) {
    

    const company = await this.companyModel.findById(companyId)

    if(!company){
      throw new NotFoundException(`Company not found`)
    }

    company.coverPic = null
    await company.save()

    return { message : `Cover deleted successfully`};
  }
}
