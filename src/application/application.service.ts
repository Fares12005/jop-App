import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from 'src/DB/models/Application .model';
import { Job } from 'src/DB/models/Job.model';
import { User } from 'src/DB/models/User.model';
import { s3Uploader } from 'src/Utils/multer/S3.util';
import { Company } from 'src/DB/models/Company.model';
import { SocketGateway } from 'src/Common/Geatway/soket.getway';
import { privateDecrypt } from 'crypto';

@Injectable()
export class ApplicationService {

  constructor(
    @InjectModel(`Application`) private readonly applicationModel : Model<Application>,
    @InjectModel(`User`) private readonly userModel : Model<User>,
    @InjectModel(`Job`) private readonly jobModel : Model<Job>,
    @InjectModel(`Company`) private readonly companyModel : Model<Company>,
    private readonly socketGateway: SocketGateway,
  ){}


   async Create(userId: Types.ObjectId, jobId: Types.ObjectId , file: Express.Multer.File) {

    const userIdExist = await this.userModel.findById(userId);
    if(!userIdExist){
      throw new Error(`User with id ${userId} not found`);
    }

    const jobIdExist = await this.jobModel.findById(jobId);
    if(!jobIdExist){
      throw new Error(`Job with id ${jobId} not found`);
    }

    const applicationExist = await this.applicationModel.findOne({userId,jobId});
    if(applicationExist){
      throw new BadRequestException(` the user or job already exist`);
    }

    const uploadResult = await s3Uploader( file, 'company-cover');
                
                const updatedUser = await this.applicationModel.create(
                    {
                        userId:userId,
                        jobId:jobId,
                        userCV: uploadResult
                    },
                );
        
                if (!updatedUser) {
                    throw new NotFoundException(`Application with ID  not found.`);
                }
        
                return { 
                    message: "Profile picture uploaded to S3 and user data updated successfully", 
                    data: uploadResult,
                    user: updatedUser 
                };




  }


async getJobApplications(jobId: Types.ObjectId,requestingUserId: Types.ObjectId,requestingUserRole: string,limit: number,page: number,sortField: string) {
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {throw new NotFoundException(`Job with ID ${jobId} not found.`);}

    const companyId = job.companyId;

    
    const isOwner = (requestingUserRole === 'owner' || requestingUserRole === 'admin');
    
    
    const companyOwnedByUser = await this.companyModel.findOne({ _id: companyId, ownerId: requestingUserId })


    const isHR = (requestingUserRole === 'hr'); 

    if (!companyOwnedByUser && !isHR) {throw new ForbiddenException('Access denied. You are not authorized to view these applications.');}
    
    const filter: any = { jobId: jobId };
    const skip = (page - 1) * limit;

    const totalCount = await this.applicationModel.countDocuments(filter).exec();

    const applications = await this.applicationModel.find(filter).sort(sortField).skip(skip).limit(limit).populate('userId', '-password') 

    return {applications,totalCount,currentPage: page, totalPages: Math.ceil(totalCount / limit),limit,};
}


async applyToJob(jobId: Types.ObjectId,userId: Types.ObjectId,file: Express.Multer.File ) {
        const applicationExist = await this.applicationModel.findOne({ userId, jobId }).exec();
        if (applicationExist) {
            throw new BadRequestException('You have already applied for this job.');
        }

        const job = await this.jobModel.findById(jobId).exec();
        if (!job) {
             throw new NotFoundException(`Job with ID ${jobId} not found.`);
        }
        
        const companyId = job.companyId;

        const uploadResult = await s3Uploader(file, `job-applications/${userId}/${jobId}`); 
        
        if (!uploadResult || !uploadResult) {
            throw new InternalServerErrorException('Failed to upload CV file.');
        }
        
        const newApplication = await this.applicationModel.create({userId,jobId,userCV: uploadResult,applicationStatus: 'Pending', });

        
        const company = await this.companyModel.findById(companyId).exec() ; 
        const hrOrOwnerId = company; 

        if (hrOrOwnerId) {
             this.socketGateway.sendApplicationNotification(hrOrOwnerId.toString(), {message: `New application submitted for job: ${job.jobTitle}`,applicantId: userId.toString(),jobId: jobId.toString(),});
    }
        
        return { 
            message: 'Application submitted successfully',
            application: newApplication 
        };
    }



    async updateApplicationStatus(applicationId: Types.ObjectId,newStatus: 'Accepted' | 'Rejected',hrId: Types.ObjectId ) {

      const hr = await this.userModel.findById(hrId).exec();
      if (!hr) {
        throw new NotFoundException(`HR ID ${hrId} not found.`);
      }
      
        const application = await this.applicationModel.findById(applicationId).exec();
        
        if (!application) {
            throw new NotFoundException(`Application ID ${applicationId} not found.`);
        }

        const updatedApplication = await this.applicationModel.findByIdAndUpdate(
            applicationId,
            { applicationStatus: newStatus },
            { new: true } 
        )

        return {message: `Application status updated to ${newStatus}. No email notification sent.`,application: updatedApplication,};
    }





  create(createApplicationDto: CreateApplicationDto) {
    return 'This action adds a new application';
  }

  findAll() {
    return `This action returns all application`;
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }



  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
