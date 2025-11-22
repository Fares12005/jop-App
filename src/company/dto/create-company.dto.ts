import { IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateCompanyDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    companyName : string;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    @IsNotEmpty()
    description : string;

    @IsString()
    @IsNotEmpty()
    industry : string;

    @IsString()
    @IsNotEmpty()
    numberOfEmployees : string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    companyEmail : string;


}

export class UpdateDataCompanyDto {

    @IsString()
    industry : string;

    @IsString()
    numberOfEmployees : string;
    
}

export class UpdateAllCompanyDto {
    @IsString()
    companyName : string;

    @IsString()
    description : string;

    @IsString()
    industry : string;

    @IsString()
    numberOfEmployees : string;

    @IsString()
    companyEmail : string;

    
    
}