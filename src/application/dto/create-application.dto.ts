import { IsNotEmpty, IsString } from "class-validator";

export class CreateApplicationDto {

    @IsString()
    @IsNotEmpty()
    userCV : string;
}
