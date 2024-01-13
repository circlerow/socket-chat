import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { UserInfo } from 'src/schema/user-info.schema';
import { getFilePath } from 'src/share/utils';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel(UserInfo.name)
    private readonly userModel: Model<UserInfo>,
  ) {}

  async create(user: any, avatar?: Express.Multer.File) {
    const userInfo = {
      id: nanoid(8),
      ...user,
    };
    userInfo.avatar = getFilePath(avatar);
    return await this.userModel.create(userInfo);
  }

  async getUserInfo(userId: string) {
    return await this.userModel.findOne({ userId: userId });
  }

  async updateUserInfo(
    userId: string,
    userInfo: UserInfo,
    avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      userInfo.avatar = getFilePath(avatar);
    }
    return await this.userModel.findOneAndUpdate({ userId: userId }, userInfo, {
      new: true,
    });
  }
}
