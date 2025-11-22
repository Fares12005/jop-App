import { isEnum, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { GenderEnum } from "src/Common/enums/User.enum";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @IsEnum(GenderEnum , {message : "must be chosen from male or female"})
    gender : string;

    @IsString()
    @IsNotEmpty()
    DOB : string;

    @IsString()
    @IsNotEmpty()
    mobileNumber : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    lastName : string;


}

export class UpdatePasswordDto {

    @IsString()
    @IsNotEmpty()
    oldPassword : string;

    @IsString()
    @IsNotEmpty()
    password : string;
    
}


