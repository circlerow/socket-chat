import { Injectable } from "@nestjs/common";
import { User } from "../../schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser } from "../../gateway/interface/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {
  }

  async getByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email: email });
  }

  async getAll() {
    return this.userModel.find();
  }

  async create(user: User) {
    return await this.userModel.create(user);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, user: User) {
    return this.userModel.findByIdAndUpdate(id, user, {
      new: true
    });
  }
}