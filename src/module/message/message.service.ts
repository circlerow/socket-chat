import { Injectable, Logger } from '@nestjs/common';
import { Message } from '../../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  @Cron('0 0 0 * * *')
  async handleCron() {
    await this.deleteAllMessage();
    this.logger.log('Delete all message');
  }

  async deleteAllMessage() {
    await this.messageModel.deleteMany({});
  }

  async createMessage(message: Message) {
    return await this.messageModel.create(message);
  }

  async getMessageById(id: string) {
    const message: any = await this.messageModel.findOne({ id });
    return {
      message: message.message,
      createdAt: message.createdAt,
      toUserId: message.toUserId,
      fromUserId: message.fromUserId,
    };
  }
}
