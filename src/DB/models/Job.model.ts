import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum } from "src/Common/enums/User.enum";
import { User } from "./User.model";
import { JobLocationEnum, seniorityLevelEnum, workingTimeEnum } from "src/Common/enums/Job.enum";



@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class Job {

    @Prop({ required : true , type : String , minlength : 10 , maxlength : 70 })
    jobTitle : string;

    @Prop({ required : true , type : String  , enum : JobLocationEnum , default : JobLocationEnum.ON_SITE })
    jobLocation : string;

    @Prop({ required : true , type : String  , enum : workingTimeEnum , default : workingTimeEnum.FULL_TIME })
    workingTime : string;

    @Prop({ required : true , type : String  , enum : seniorityLevelEnum , default : seniorityLevelEnum.FRESHER })
    seniorityLevel : string;

    @Prop({ required : true , type : String  , minlength : 10 , maxlength : 1000 })
    jobDescription : string;

    @Prop({ required : true , type : [String] })
    technicalSkills : string[];

    @Prop({ required : true , type : [String] })
    softSkills : string[];

    @Prop({ required : true , type : mongoose.Schema.Types.ObjectId , ref : `User` })
    addedBy : Types.ObjectId;

    @Prop({ required : true , type : mongoose.Schema.Types.ObjectId , ref : `User` })
    updatedBy : Types.ObjectId;

    @Prop({ required : true , type : Boolean , default : false })
    closed : boolean;

    @Prop({ required : true , type : mongoose.Schema.Types.ObjectId , ref : `Company` })
    companyId : Types.ObjectId;

    
}


export const JobSchema = SchemaFactory.createForClass(Job);
export type JobDocument = HydratedDocument<Job>;
export const JobModel = MongooseModule.forFeature([{ name: `Job`, schema: JobSchema }])