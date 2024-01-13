import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserInfoService } from './userinfo.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-info')
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() user: any, @UploadedFile() avatar: Express.Multer.File) {
    return await this.userInfoService.create(user, avatar);
  }

  @Get(':userId')
  async getUserInfo(@Param('userId') userId: string) {
    return await this.userInfoService.getUserInfo(userId);
  }

  @Put(':userId')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserInfo(
    @Param('userId') userId: string,
    @Body() userInfo: any,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return await this.userInfoService.updateUserInfo(userId, userInfo, avatar);
  }
}
