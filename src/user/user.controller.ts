import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/Common/Guard/auzhontication.guard';
import { uploadFileToMemory } from 'src/Utils/multer/file.multer';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(uploadFileToMemory())
  @Post(`profilePic/:userId`)
  profilePic(@UploadedFile() file: Express.Multer.File , @Param('userId') userId: string) {
    return this.userService.profilePic(file , userId);
  }

  @UseInterceptors(uploadFileToMemory())
  @Post(`coverPic/:userId`)
  coverPic (@UploadedFile() file: Express.Multer.File , @Param('userId') userId: string) {
    return this.userService.coverPic(file , userId);
  }

  @Get(`get-data/:userId`)
  find(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }


  @UseGuards(AuthGuard)
  @Get(`getProfile`)
  findOne(@Req() req: any) {
    return this.userService.findOne(req.user.id );
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  update(@Req() req: any , @Body() createUserDto: CreateUserDto) {
    return this.userService.update(req.user.id , createUserDto);
  }

  @Patch('update-password/:userId')
  updatePassword(@Param('userId') userId: string , @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(userId , updatePasswordDto);
  }

  @Delete('delete-profile-pic/:userId')
  removeProfilePic(@Param('userId') userId: string) {
    return this.userService.removeProfilePic(userId);
  }

  @Delete('delete-cover-pic/:userId')
  removeCoverPic(@Param('userId') userId: string) {
    return this.userService.removeCoverPic(userId);
  }

  @Delete('soft-delete/:userId')
  SoftDelete(@Param('userId') userId: string) {
    return this.userService.softDelete(userId);
  }
}
