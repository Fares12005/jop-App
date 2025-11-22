import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum } from "src/Common/enums/User.enum";
import { User } from "./User.model";
import { JobLocationEnum, seniorityLevelEnum, workingTimeEnum } from "src/Common/enums/Job.enum";
import { JobStatusEnum } from "src/Common/enums/Application.enum";



@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class Application {

    @Prop({ required : true , type : Types.ObjectId , ref : `Job` })
    jobId : Types.ObjectId | null;
    
    @Prop({ required : true , type : Types.ObjectId , ref : `User` })
    userId : Types.ObjectId; 

    @Prop({ required : true ,  type: {secure_url: { type: String, required: true },public_id: { type: String, required: true }} })
    userCV : {secure_url: string; public_id: string};

    @Prop({ required : true , type : String , enum : JobStatusEnum , default : JobStatusEnum.PENDING })
    status : string;
    
}


export const ApplicationSchema = SchemaFactory.createForClass(Application);
export type ApplicationDocument = HydratedDocument<Application>;
export const ApplicationModel = MongooseModule.forFeature([{ name: `Application`, schema: ApplicationSchema }])