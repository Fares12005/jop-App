import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/User.model';
import { JwtService } from '@nestjs/jwt';
import { id } from 'zod/locales';
import { s3Uploader } from 'src/Utils/multer/S3.util';
import { CombarePassword } from 'src/Utils/Hashing/hash.util';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ){}


  async profilePic( file: Express.Multer.File , userId: string) {

    // 1. ⬆️ الرفع لخدمة AWS S3
        // 'user-profiles' هنا هو اسم الـ Folder داخل الـ Bucket في S3
        const uploadResult = await s3Uploader(file, 'user-profiles');
        
        // uploadResult دلوقتي فيه { secure_url: '...', public_id: '...' }

        // 2. 💾 تحديث بيانات المستخدم في قاعدة البيانات
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { profilePic: uploadResult }, // تخزين الأوبجكت بالكامل
            { new: true, runValidators: true } // {new: true} ليرجع الدوكيومنت بعد التحديث
        ).exec();

        // 3. 🚨 التحقق من وجود المستخدم
        if (!updatedUser) {
            // لو الـ ID غلط ومش لاقي اليوزر
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        // 4. ✅ إرجاع النتيجة
        return { 
            message: "Profile picture uploaded to S3 and user data updated successfully", 
            data: uploadResult,
            user: updatedUser 
        };
      
  }

  async coverPic( file: Express.Multer.File , userId: string) {

     // 1. ⬆️ الرفع لخدمة AWS S3
        // 'user-profiles' هنا هو اسم الـ Folder داخل الـ Bucket في S3
        const uploadResult = await s3Uploader(file, 'user-profiles');
        
        // uploadResult دلوقتي فيه { secure_url: '...', public_id: '...' }

        // 2. 💾 تحديث بيانات المستخدم في قاعدة البيانات
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { coverPic: uploadResult }, // تخزين الأوبجكت بالكامل
            { new: true, runValidators: true } // {new: true} ليرجع الدوكيومنت بعد التحديث
        ).exec();

        // 3. 🚨 التحقق من وجود المستخدم
        if (!updatedUser) {
            // لو الـ ID غلط ومش لاقي اليوزر
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        // 4. ✅ إرجاع النتيجة
        return { 
            message: "Profile picture uploaded to S3 and user data updated successfully", 
            data: uploadResult,
            user: updatedUser 
        };
  }

  findOne(userId: string) {

    const user = this.userModel.findById(userId).select("mobileNumber profilePic coverPic userName")

    if(!user){
      throw new Error("User not found")
    }

    return user
  }

  async update(userId: string , createUserDto: CreateUserDto) {

    const {firstName , lastName , mobileNumber , DOB , gender} = createUserDto

    const user = await this.userModel.findById(userId)

    if(!user){
      throw new Error("User not found")
    }

   user.firstName = firstName
   user.lastName = lastName
   user.mobileNumber = mobileNumber
   user.DOB = DOB
   user.gender = gender

    await user.save()

    return {message : "User updated successfully"}
  }

async updatePassword(userId: string , updatePasswordDto: UpdatePasswordDto) {
    const {password , oldPassword} = updatePasswordDto
    const user = await this.userModel.findById(userId).exec();

    if(!user){
        throw new Error("User not found");
    }

    if (!user.password) {
        throw new BadRequestException("This user does not have a password ");
    }
    
    const isMatch = await CombarePassword({plantext : oldPassword , hash : user.password});
    
    if(!isMatch){
        throw new BadRequestException("Invalid old password");
    }

    user.password = password
    await user.save()

    return {message : "Password updated successfully"}
}


  async removeProfilePic(userId: string) {
    const user = await this.userModel.findById(userId)

    if(!user){
      throw new Error("User not found")
    }

    user.profilePic = null
    await user.save()

    return {message : "Profile picture removed successfully"}
  }

  async removeCoverPic(userId: string) {
    const user = await this.userModel.findById(userId)

    if(!user){
      throw new Error("User not found")
    }

    user.coverPic = null
    await user.save()

    return {message : "Cover picture removed successfully"}
  }

  async softDelete(userId: string) {
    const user = await this.userModel.findById(userId)

    if(!user){
      throw new Error("User not found")
    }

    user.isDeleted = true
    user.deletedAt = new Date()
    await user.save()

    return {message : "User soft deleted successfully"}
  }
}
