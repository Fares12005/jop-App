import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";




@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class Company {

    @Prop({ required : true , type : String , unique : true , minlength : 2 , maxlength : 50 })
    companyName: string;

    @Prop({ type : String , required : true , minlength : 10 , maxlength : 500 })
    description : string;

    @Prop({ type : String , required : true })
    industry : string;

    @Prop({ type : String })
    address : string;

    @Prop({ type : String })
    numberOfEmployees : string;

    @Prop({ type : String  , unique : true , trim : true })
    companyEmail : string;

    @Prop({ type : mongoose.Schema.Types.ObjectId , ref : `User` })
    createdBy : Types.ObjectId;

    @Prop({ type: {secure_url: { type: String, required: true },public_id: { type: String, required: true }} })
    logo : {secure_url : string, public_id : string} | null;

    @Prop({ type: {secure_url: { type: String, required: true },public_id: { type: String, required: true }} })
    coverPic : {secure_url : string, public_id : string} | null;

    @Prop({ type : [mongoose.Schema.Types.ObjectId] , ref : `Job` })
    jops : Types.ObjectId[];

    @Prop({ type : [mongoose.Schema.Types.ObjectId] , ref : `User` })
    HRs : Types.ObjectId[];

    @Prop({ type : Date })
    deletedAt : Date;

    @Prop({ type : Boolean })
    IsDeleted : boolean;

    @Prop({ type : Date })
    bannedAt : Date;

    @Prop({ type : mongoose.Schema.Types.ObjectId , ref : `User` })
    bannedByAdminAt : Types.ObjectId;

    @Prop({ type : String })
    legalAttachment : string;

    @Prop({ type : Boolean })
    approved :boolean;

    @Prop({ type : mongoose.Schema.Types.ObjectId , ref : `User` })
    approvedByAdmin :Types.ObjectId;





    

    



    
}


export const CompanySchema = SchemaFactory.createForClass(Company);
export type CompanyDocument = HydratedDocument<Company>;
export const CompanyModel = MongooseModule.forFeature([{ name: `Company`, schema: CompanySchema }])