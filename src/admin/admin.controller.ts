import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/Common/Guard/auzhontication.guard';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get(`All-usersAndCompanies`)
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('ban-user/:userId')
  updateUser(@Param('userId') userId: string , @Req() req) {
    const adminId = req.user.id;

    return this.adminService.updateUser(userId , adminId);
  }

  @UseGuards(AuthGuard)
  @Patch('ban-company/:companyId')
  updateCompany(@Param('companyId') companyId: string , @Req() req) {
    const adminId = req.user.id;

    return this.adminService.updateCompany(companyId , adminId);
  }

  @UseGuards(AuthGuard)
  @Patch('approve-company/:companyId')
  approveCompany(@Param('companyId') companyId: string , @Req() req) {
    const adminId = req.user.id;

    return this.adminService.approveCompany(companyId , adminId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
