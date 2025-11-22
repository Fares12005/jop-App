import { PartialType } from '@nestjs/mapped-types';
import { CreateJopDto } from './create-jop.dto';

export class UpdateJopDto extends PartialType(CreateJopDto) {}
