import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Common/Guard/auzhontication.guard';

@Controller('api/application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}



  @UseInterceptors(FileInterceptor('file'))
  @Post('createApp/:userId/:jobId')
  CreateApplication(@Param('userId') userId: Types.ObjectId, @Param('jobId') jobId: Types.ObjectId , @UploadedFile() file: Express.Multer.File) {
    return this.applicationService.Create(userId, jobId , file);
  }

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }


  @UseGuards(AuthGuard) 
    @Post(':jobId')
    @UseInterceptors(FileInterceptor('cv')) 
    async applyToJob(@Param('jobId') jobId: string, @UploadedFile() file: Express.Multer.File,@Req() req: any){
        if (!file) {throw new BadRequestException('CV file is required for application.');}

        const userId = req.user.id; 

        return this.applicationService.applyToJob(new Types.ObjectId(jobId),new Types.ObjectId(userId),file);
    }


    @UseGuards(AuthGuard)
@Patch(':applicationId/status')
async updateApplicationStatus(
    @Param('applicationId') applicationId: Types.ObjectId,
    @Body() body: UpdateApplicationDto,
    @Req() req: any
) {
    const { status } = body;
    
    // التحقق من أن القيمة المرسلة سليمة
    if (status !== 'Accepted' && status !== 'Rejected') {
        throw new BadRequestException('Invalid status value. Must be "Accepted" or "Rejected".');
    }

    const hrId = req.user.id; 
    
    return this.applicationService.updateApplicationStatus(
        applicationId,
        status,
        new Types.ObjectId(hrId)
    );
}



  @UseGuards(AuthGuard) 
@Get('job/:jobId') 
getJobApplications(@Param('jobId') jobId: Types.ObjectId, @Query('limit') limit: string = '10',@Query('page') page: string = '1',@Query('sort') sort: string = '-createdAt', @Req() req: any ) {
    const userId = new Types.ObjectId(req.user.id);
    const userRole = req.user.role; 

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    
    return this.applicationService.getJobApplications(jobId,userId,userRole,limitNum,pageNum,sort);}

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
