import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { UserInfo } from 'src/schema/user-info.schema';
import { getFilePath } from 'src/share/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel(UserInfo.name)
    private readonly userInfoModel: Model<UserInfo>,
    private readonly userService: UserService,
  ) {}

  async create(user: any, avatar?: Express.Multer.File) {
    const name = await this.userService.getUserName(user.userId);
    const userInfo = {
      id: nanoid(8),
      name,
      ...user,
    };
    userInfo.avatar = getFilePath(avatar);
    await this.userService.changeHasInfo(user.userId);
    return await this.userInfoModel.create(userInfo);
  }

  async getUserInfo(userId: string) {
    return await this.userInfoModel.findOne({ userId: userId });
  }

  async updateUserInfo(
    userId: string,
    userInfo: UserInfo,
    avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      userInfo.avatar = getFilePath(avatar);
    }
    return await this.userInfoModel.findOneAndUpdate(
      { userId: userId },
      userInfo,
      {
        new: true,
      },
    );
  }
}
