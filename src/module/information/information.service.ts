import { Injectable } from "@nestjs/common";
import { Information } from "../../schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class InformationService {
  constructor(
    @InjectModel(Information.name)
    private readonly informationModel: Model<Information>
  ) {
  }

  async createInformation(information: Information) {
    return await this.informationModel.create(information);
  }

  async deleteInformation(information: Information) {
    return this.informationModel.deleteOne(information);
  }

  async getSocketIdByUserIds(userIds: string[]) {
    return this.informationModel.find({ userId: { $in: userIds } });
  }
}