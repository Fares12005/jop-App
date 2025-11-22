import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { JopService } from './jop.service';
import { CreateJopDto } from './dto/create-jop.dto';
import { UpdateJopDto } from './dto/update-jop.dto';
import { AuthGuard } from 'src/Common/Guard/auzhontication.guard';
import { Types } from 'mongoose';

@Controller('api/jop')
export class JopController {
  constructor(private readonly jopService: JopService) {}

  @UseGuards(AuthGuard)
  @Post(`Create-jop/:companyId`)
  createJop(@Body() createJopDto: CreateJopDto , @Param(`companyId`)  companyId : Types.ObjectId , @Req() req : any) {
    const hrId = req.user.id;
    return this.jopService.createJop(createJopDto , hrId , companyId);
  }

@UseGuards(AuthGuard)
    @Get('company/jobs')
    findAllJobs(@Query('companyName') companyName: string = '',  @Query('Limit') limit: string = "10", @Query('page') page: string = "1", @Query('sort') sort: string = "-createdAt",@Req() req: any) {
        const userId = req.user.id;
        return this.jopService.findAll(null, companyName, limit, page, sort, userId);
    }

    @UseGuards(AuthGuard)
    @Get('company/jobs/:jobId')
    findSpecificJob(@Param('jobId') jobIdString: string,@Query('companyName') companyName: string = '', @Query('Limit') limit: string = "10",  @Query('page') page: string = "1", @Query('sort') sort: string = "-createdAt", @Req() req: any) {
        if (!Types.ObjectId.isValid(jobIdString)) {
             throw new BadRequestException('Invalid job ID format.');
        }

        const userId = req.user.id;
        return this.jopService.findAll(jobIdString as any, companyName, limit, page, sort, userId);
    }

    @Get('search') 
    searchAllJobs(@Query('limit') limit: string = '10',@Query('page') page: string = '1',@Query('sort') sort: string = '-createdAt', @Query('workingTime') workingTime: string = '',@Query('jobLocation') jobLocation: string = '',@Query('seniorityLevel') seniorityLevel: string = '',@Query('jobTitle') jobTitle: string = '',@Query('technicalSkills') technicalSkills: string = '', ) {
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);
        
        return this.jopService.searchAndFilterJobs(limitNum,pageNum,sort,workingTime,jobLocation,seniorityLevel,jobTitle,technicalSkills);}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jopService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('Update-Data/:jobId')
  update(@Param('jobId') jobId: Types.ObjectId, @Body() updateJopDto: UpdateJopDto , @Req() req : any) {
    const hrId = req.user.id;
    return this.jopService.updateJop(jobId, updateJopDto , hrId);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-jop/:jobId')
  remove(@Param('jobId') jobId: Types.ObjectId , @Req() req : any) {
    const hrId = req.user.id;
    return this.jopService.deleteJop(jobId , hrId);
  }
}
