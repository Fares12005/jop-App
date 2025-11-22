import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfirmEmailDto, CreateSignupDto, ForgotPasswordDto, LoginDto, LoginGoogleDto, ResetPasswordDto, SignUpGoogleDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/User.model';
import { Otp } from 'src/DB/models/Otp.model';
import { nanoid } from 'nanoid';
import { OtpEnum } from 'src/Common/enums/otp.enum';
import { CombarePassword } from 'src/Utils/Hashing/hash.util';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';


@Injectable()
export class AuthService {

  private googleClient = new OAuth2Client(process.env.CLIENT_ID);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(`otp`) private readonly otpModel: Model<Otp>,
    private readonly jwtService: JwtService
  ){}

  
 async create( body: CreateSignupDto ) {
    const {firstName, lastName, email, password, confirmPassword , DOB, mobileNumber , role} = body

    const user = await this.userModel.findOne({email})
    if(user){
      throw new BadRequestException(`User with email already exists`)
    }

     const Creatuser = await this.userModel.create({ firstName, lastName,  email, password, confirmPassword, DOB, mobileNumber , role })


    const otp = nanoid(6)

    const otpData = await this.otpModel.create({ code: otp ,  expiresAt: new Date(Date.now() + 10 * 60 * 1000) , createdBy : Creatuser._id , type : OtpEnum.CONFIRM_EMAIL })

    if(!otpData){
      throw new BadRequestException(`Otp not created`)
    }




 return {Creatuser , message : `User created successfully`}




  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto){

    const {email , code} = confirmEmailDto
    const user = await this.userModel.findOne({email , isConfirmed : false})
    if(!user){
      throw new BadRequestException(`User not found`)
    }

    const otp = await this.otpModel.findOne({type : OtpEnum.CONFIRM_EMAIL , expiresAt : { $gt : new Date() }, code:code})
    if(!otp){
      throw new BadRequestException(`Otp not found`)
    }

    if(otp.code !== code){
      throw new BadRequestException(`Invalid Otp`)
    }

    user.isConfirmed = true
    await user.save()

    
    return { message : `Email confirmed successfully`}
    
  }

  async login(loginDto: LoginDto){
    const {email , password} = loginDto
    const user = await this.userModel.findOne({email , isConfirmed : true})
    if(!user){
      throw new BadRequestException(`User not found`)
    }

    const comparePassword = await CombarePassword({plantext : password , hash : user.password})

    if(!comparePassword){
      throw new BadRequestException(`Invalid password`)
    }

    const accessToken = this.jwtService.sign({id : user._id , email : user.email} , {secret : process.env.ACCESS_TOKEN_SECRET , expiresIn : Number(process.env.ACCESS_TOKEN_EXPIRES_IN)})
    const refreshToken = this.jwtService.sign({id : user._id , email : user.email} , {secret : process.env.REFRESH_TOKEN_SECRET , expiresIn : Number(process.env.REFRESH_TOKEN_EXPIRES_IN)})  


    return { message : `User logged in successfully` , accessToken , refreshToken}
  }

  async signUpGoogle(signUpGoogleDto: SignUpGoogleDto){

    const {idToken} = signUpGoogleDto

   const ticket = await this.googleClient.verifyIdToken({
  idToken: idToken,
  audience: process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();

if (!payload) {
  throw new BadRequestException("Invalid Google token");
}

const { email, given_name, family_name, picture } = payload;

  let user = await this.userModel.findOne({ email });

  if (user) {
    throw new BadRequestException("User already exists");
  }

  user = await this.userModel.create({
    firstName: given_name,
    lastName: family_name,
    email,
    profilePic: picture,
    provider: "google",
    isConfirmed: true,
  });

  return { message: "User created with Google", user };





  }

  async loginGoogle(loginGoogleDto: LoginGoogleDto){
    const { idToken } = loginGoogleDto;

   const ticket = await this.googleClient.verifyIdToken({
  idToken: idToken,
  audience: process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();

if (!payload) {
  throw new BadRequestException("Invalid Google token");
}
  const { email } = payload;

  const user = await this.userModel.findOne({ email });

  if (!user) {
    throw new BadRequestException("No account, please sign up first");
  }

  const accessToken = this.jwtService.sign({ id: user._id, email: user.email },{ secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) });

  const refreshToken = this.jwtService.sign({ id: user._id, email: user.email },{ secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) });

  return {
    message: "Logged in with Google",
    accessToken,
    refreshToken,
  };

  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto){
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email , isConfirmed : true });

    if (!user) {
      throw new BadRequestException("No account, please sign up first");
    }

   const otpDataExist = await this.otpModel.findOne({type : OtpEnum.FORGOT_PASSWORD , expiresAt : { $gt : new Date() }})

    if(otpDataExist){
     throw new BadRequestException(`otp already sent`)
   }
   
   const otp = nanoid(6)

   const otpData = await this.otpModel.create({ code: otp ,  expiresAt: new Date(Date.now() + 1 * 60 * 1000) , createdBy : user._id , type : OtpEnum.FORGOT_PASSWORD })


  

   if(!otpData){
     throw new BadRequestException(`Otp not created`)
   }

   

   return {message : `Otp sent successfully`}

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto){

      const {email , code , password , confirmPassword} = resetPasswordDto

      const user = await this.userModel.findOne({ email , isConfirmed : true });

      if (!user) {
        throw new BadRequestException("No account, please sign up first");
      }

      const otp = await this.otpModel.findOne({type : OtpEnum.FORGOT_PASSWORD , expiresAt : { $gt : new Date() }, code:code})
      if(!otp){
        throw new BadRequestException(`Otp not found`)
      }

      if(otp.code !== code){
        throw new BadRequestException(`Invalid Otp`)
      }

      user.password = password
      user.changeCredentialTime = new Date()
      await user.save()

      return {message : `Password reset successfully`}

    
  }


  

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
