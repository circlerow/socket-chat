import { Injectable } from "@nestjs/common";
import { UserConversation } from "../../schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InitConversationDto } from "./dto/init-conversation.dto";

@Injectable()
export class UserConversationService {
  constructor(
    @InjectModel(UserConversation.name)
    private readonly messageModel: Model<UserConversation>
  ) {
  }

  async createUsersConversation(initConversation: InitConversationDto) {
    return await this.messageModel.create(initConversation);
  }

  async get(conversationId: string) {
    return this.messageModel.find({ conversationId });
  }
}