import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateJopDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(70)
    jobTitle : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(1000)
    jobDescription : string;

    @IsNotEmpty()
    technicalSkills : string[];

    @IsNotEmpty()
    softSkills : string[];

}
