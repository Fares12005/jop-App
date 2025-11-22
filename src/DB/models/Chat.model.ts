import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum } from "src/Common/enums/User.enum";
import { User } from "./User.model";
import { JobLocationEnum, seniorityLevelEnum, workingTimeEnum } from "src/Common/enums/Job.enum";
import { JobStatusEnum } from "src/Common/enums/Application.enum";



@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class Chat {

    @Prop({ required : true , type : Types.ObjectId , ref : `User` })
    senderId : Types.ObjectId;
    
    @Prop({ required : true , type : Types.ObjectId , ref : `User` })
    receiverId : Types.ObjectId;
    
    @Prop({ required : true , type : [String] })
    message : string[];
    
}


export const ChatSchema = SchemaFactory.createForClass(Chat);
export type ChatDocument = HydratedDocument<Chat>;
export const ChatModel = MongooseModule.forFeature([{ name: `Chat`, schema: ChatSchema }])