import { Injectable } from "@nestjs/common";
import { Message } from "../../schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>
  ) {
  }

  async createMessage(message: Message) {
    return await this.messageModel.create(message);
  }

  async getMessagesByConversationId(conversationId: string) {
    return this.messageModel.find({ conversationId });
  }
}