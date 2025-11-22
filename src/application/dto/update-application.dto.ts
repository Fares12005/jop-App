import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {

    @IsNotEmpty({ message: 'Status is required.' })
    @IsString({ message: 'Status must be a string.' })
    @IsIn(['Accepted', 'Rejected'], { message: 'Status must be either Accepted or Rejected.' })
    status: 'Accepted' | 'Rejected'; 
}
