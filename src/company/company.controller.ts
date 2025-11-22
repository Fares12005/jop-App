import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateAllCompanyDto, UpdateDataCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/Common/Guard/auzhontication.guard';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard)
  @Post(`Create-company`)
  createCompany(@Body() createCompanyDto: CreateCompanyDto , @Req() req:any) {
    const ownerId=req.user.id;
    return this.companyService.createCompany(createCompanyDto , ownerId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(`Upload-logo/:companyId`)
  uploadLogo(@Param('companyId') companyId: Types.ObjectId , @Req() req:any , @UploadedFile() file: Express.Multer.File) {
    const ownerId=req.user.id;
    return this.companyService.uploadLogo(ownerId , file , companyId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(`Upload-cover/:companyId`)
  uploadCover(@Param('companyId') companyId: Types.ObjectId , @Req() req:any , @UploadedFile() file: Express.Multer.File) {
    const ownerId=req.user.id;
    return this.companyService.uploadCover(ownerId , file , companyId);
  }

  @Patch(`Add-HR/:companyId/:hrId`)
  addHR(@Param('hrId') hrId: Types.ObjectId , @Param('companyId') companyId: Types.ObjectId) {
    return this.companyService.addHR(hrId , companyId);
  }

  @UseGuards(AuthGuard)
  @Patch(`Update-company/:companyId`)
  updateData(@Param('companyId') companyId: Types.ObjectId , @Req() req:any , @Body() updateCompanyDto: UpdateDataCompanyDto) {
    const ownerId=req.user.id;
    return this.companyService.updateData(companyId , ownerId , updateCompanyDto);
  }

  @UseGuards(AuthGuard)
  @Patch(`UpdateAll-data/:companyId`)
  updatAllData(@Param('companyId') companyId: Types.ObjectId , @Req() req:any , @Body() updateAllCompanyDto: UpdateAllCompanyDto) {
    const userId=req.user.id;
    return this.companyService.updateAllData(companyId , userId , updateAllCompanyDto);
  }

  @Get(`company-name`)
  searchCompany(@Query(`name`) name:string ) {
    return this.companyService.searchCompany(name);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @UseGuards(AuthGuard)
  @Delete(`Delete-company/:companyId`)
  remove(@Param('companyId') companyId: Types.ObjectId , @Req() req:any) {
    const ownerId=req.user.id;
    return this.companyService.Softremove(companyId , ownerId);
  }




  @Delete(`Delete-logo/:companyId`)
  deleteLogo(@Param('companyId') companyId: Types.ObjectId , @Req() req:any) {
    return this.companyService.deleteLogo( companyId);
  }

  @Delete(`Delete-cover/:companyId`)
  deleteCover(@Param('companyId') companyId: Types.ObjectId , @Req() req:any) {
    return this.companyService.deleteCover( companyId);
  }
}
