import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJopDto } from './dto/create-jop.dto';
import { UpdateJopDto } from './dto/update-jop.dto';
import { User } from 'src/DB/models/User.model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'src/DB/models/Job.model';
import { Company } from 'src/DB/models/Company.model';

@Injectable()
export class JopService {

  constructor(
    @InjectModel(`User`) private userModel : Model<User>,
    @InjectModel(`Job`) private jobModel : Model<Job>,
    @InjectModel(`Company`) private companyModel : Model<Company>
  ){}


  async createJop(createJopDto: CreateJopDto , hrId : Types.ObjectId , companyId : Types.ObjectId) {
    const {jobTitle , jobDescription , technicalSkills , softSkills} = createJopDto;

    const hrExist = await this.userModel.findById(hrId);
    if(!hrExist)
      throw new BadRequestException(`the hr id  not found`);

    const companyExist = await this.companyModel.findById(companyId);
    if(!companyExist)
      throw new BadRequestException(`the company id  not found`);

    const jop = await this.jobModel.create({jobTitle , jobDescription , technicalSkills , softSkills , addedBy : hrId , companyId: companyId , updatedBy : hrId})


    return {jop , message : `jop created successfully`};


  }

 async findAll(jobId: Types.ObjectId | null, companyName: string, limit: string, page: string, sort: string, userId: Types.ObjectId ) {
    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const userExist = await this.userModel.findById(userId).exec();
    if (!userExist)
        throw new BadRequestException(`the user id not found`);

    let filter: any = {};

    if (jobId) {
        
        filter._id = jobId;

    }

    if (companyName) {
        const companyRegex = new RegExp(companyName, 'i');

        
        const matchingCompanies = await this.companyModel.find({ 
            companyName: { $regex: companyRegex } 
        }, { _id: 1 });
        
        if (matchingCompanies.length === 0) {
            return { jobs: [], totalCount: 0, currentPage: pageNumber, totalPages: 0, limit: limitNumber };
        }

        const companyIds = matchingCompanies.map(c => c._id);
        filter.companyId = { $in: companyIds };
    }
    
    const totalCount = await this.jobModel.countDocuments(filter);

    const jobs = await this.jobModel.find(filter)
        .sort(sort) 
        .skip(skip) 
        .limit(limitNumber);

    if (jobId && jobs.length === 0) {
        throw new NotFoundException(`The requested job was not found.`);
    }
    return {
        jobs: jobId ? jobs[0] : jobs, 
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
    };
}

async searchAndFilterJobs(limit: number, page: number,sortField: string,workingTime: string,jobLocation: string, seniorityLevel: string,jobTitle: string,technicalSkills: string,) {
        const skip = (page - 1) * limit;

        let filter: any = {};
        
        if (workingTime) {
            filter.workingTime = workingTime;
        }

        if (jobLocation) {
            const locationRegex = new RegExp(jobLocation, 'i');
            filter.jobLocation = { $regex: locationRegex };
        }

        if (seniorityLevel) {
            filter.seniorityLevel = seniorityLevel;
        }

        if (jobTitle) {
            const titleRegex = new RegExp(jobTitle, 'i');
            filter.jobTitle = { $regex: titleRegex };
        }


        if (technicalSkills) {
            const skillsArray = technicalSkills.split(',').map(skill => skill.trim());
            filter.technicalSkills = { $all: skillsArray }; 
        }

        const totalCount = await this.jobModel.countDocuments(filter).exec();

        const jobs = await this.jobModel.find(filter).sort(sortField).skip(skip).limit(limit).exec();

        return { jobs, totalCount,currentPage: page,totalPages: Math.ceil(totalCount / limit),limit,};
    }


  findOne(id: number) {
    return `This action returns a #${id} jop`;
  }

  async updateJop(jobId : Types.ObjectId , updateJopDto : UpdateJopDto , hrId : Types.ObjectId) {

    const hrExist = await this.userModel.findById(hrId);
    if(!hrExist)
      throw new BadRequestException(`the hr id  not found`);
    
    const jobExist = await this.jobModel.findById(jobId);
    if(!jobExist)
      throw new BadRequestException(`the job id  not found`);

    const updatedJob = await this.jobModel.updateOne({ _id: jobId }, updateJopDto);
    return {updatedJob , message : `job updated successfully`};


  }

  async deleteJop(jobId : Types.ObjectId , hrId : Types.ObjectId) {
    const jobExist = await this.jobModel.findById(jobId);
    if(!jobExist)
      throw new BadRequestException(`the job id  not found`);

    const deletedJob = await this.jobModel.deleteOne({ _id: jobId });
    return {deletedJob , message : `job deleted successfully`};
  }
}
