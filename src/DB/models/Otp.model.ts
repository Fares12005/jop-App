import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum } from "src/Common/enums/User.enum";
import { User } from "./User.model";
import { JobLocationEnum, seniorityLevelEnum, workingTimeEnum } from "src/Common/enums/Job.enum";
import { JobStatusEnum } from "src/Common/enums/Application.enum";
import { OtpEnum } from "src/Common/enums/otp.enum";



@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class Otp {


    @Prop({ required : true , type : String })
    code : string;
    
    @Prop({ required : true , type : Date })
    expiresAt : Date;

    @Prop({ required : true , type : mongoose.Schema.Types.ObjectId , ref : `User` })
    createdBy : Types.ObjectId;

    @Prop({ required : true , type : String , enum : OtpEnum })
    type:string
}


export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ expiresAt:1 },{expireAfterSeconds: 0});
export type OtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([{ name: `otp`, schema: OtpSchema }])