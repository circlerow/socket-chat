import { Injectable } from '@nestjs/common';
import { User } from '../../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../share/interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email: email });
  }

  async getAll(request: Request) {
    const owner = await this.getInfoUser(request);
    if (!owner) {
      return [];
    }
    const users = await this.userModel.find();
    return users.filter((user) => user.id.toString() !== owner.id.toString());
  }

  async create(user: User) {
    return await this.userModel.create(user);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, user: User) {
    return this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  async getInfoUser(request: Request) {
    const bearerToken = (request.headers as any).authorization?.split('.')[1];
    if (!bearerToken) {
      return null;
    }
    const payloadJson = JSON.parse(
      Buffer.from(bearerToken, 'base64').toString('utf8'),
    );
    return await this.userModel.findOne({
      email: payloadJson.email,
    });
  }

  async updateConversationId(userId: string, conversationId: string) {
    return this.userModel.findOneAndUpdate(
      { id: userId },
      { $push: { conversationsId: conversationId } },
      { new: true },
    );
  }

  async getUserId(request: Request): Promise<string> {
    const userInfor = await this.getInfoUser(request);
    return userInfor.id;
  }

  async getConversationIds(userId: string): Promise<string[]> {
    return (await this.userModel.findOne({ id: userId })).conversationsId;
  }

  async getUserName(userId: string): Promise<string> {
    return (await this.userModel.findOne({ id: userId })).name;
  }
}
