import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { GenderEnum, ProviderEnum, UserRolesEnum } from "src/Common/enums/User.enum";
import { decryptMobile, encryptMobile } from "src/Utils/Hashing/crypto.utils";
import { hashPassword } from "src/Utils/Hashing/hash.util";



@Schema({ timestamps: true , toJSON : { virtuals : true } , toObject : { virtuals : true } })
export class User {

    @Prop({ required : true , type : String  , minlength : 2 , maxlength : 50 })
    firstName : string;

    @Prop({ required : true , type : String  , minlength : 2 , maxlength : 50 })
    lastName : string;

    userName: string;

    @Prop({ required : true , unique : true , type : String })
    email : string;

    @Prop({ required : function () { return this.provider === ProviderEnum.GOOGLE ? false : true } , min:3 , max:6 })
    password : string;

    @Prop({ required : true })
    confirmPassword : string;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: false }) 
    ownedCompanyId: Types.ObjectId;

    @Prop({ required : true , enum: ProviderEnum , default : ProviderEnum.SYSTEM })
    provider : string;

    @Prop({ required : true , enum: GenderEnum , default : GenderEnum.MALE })
    gender: string

    @Prop({ required : true })
    DOB: string;

    @Prop({ required : true , type : String })
    mobileNumber: string;

    @Prop({ required : true , enum: UserRolesEnum , default : UserRolesEnum.USER })
    role: string;

    @Prop({ required : true , default : false })
    isConfirmed: boolean;

    @Prop({ type : Date })
    deletedAt: Date;

    @Prop({ default: false, type: Boolean })
    isDeleted: boolean;

    @Prop({ type : Date })
    bannedAt: Date;

    @Prop({ type : mongoose.Schema.Types.ObjectId  , ref : User.name })
    bannedByAdminAt: Types.ObjectId;

    @Prop({ type : String  , ref : User.name })
    updatedBy: string;

    @Prop({ type : Date })
    changeCredentialTime : Date;

  @Prop({ type: {secure_url: { type: String, required: true },public_id: { type: String, required: true }}})
    profilePic: {secure_url: string; public_id: string} | null ; 

  @Prop({ type: {secure_url: { type: String, required: true },public_id: { type: String, required: true }}})
    coverPic: {secure_url: string; public_id: string} | null ; 
    
}


export const UserSchema = SchemaFactory.createForClass(User);





UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword({ plantext: this.password });
        this.confirmPassword = await hashPassword({ plantext: this.confirmPassword });

    }
    if(this.isModified(`mobileNumber`)){
        this.mobileNumber = encryptMobile(this.mobileNumber); 
    }
    UserSchema.virtual("userName").get(function () {
    return this.firstName + " " + this.lastName;
});
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

    

    next();
});



UserSchema.post(`findOne` , async function (doc){
    if (doc) { 
        doc.mobileNumber = decryptMobile(doc.mobileNumber);
    }
})


export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])