
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/DB/models/User.model';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService:JwtService ,@InjectModel(User.name) private readonly userModel: Model<User>){}


 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeadrs = request.headers.authorization;
    if(!authHeadrs && !authHeadrs.startsWith('Bearer')) 
        throw new UnauthorizedException(`missing authorization`);

    const token = authHeadrs.split(' ')[1];
    const payload = this.jwtService.verify(token , {secret: process.env.ACCESS_TOKEN_SECRET});  

    const user = await this.userModel.findById(payload.id);
    if(!user) throw new UnauthorizedException(`user not found`);

    request.user = user
    return true
  }
}
