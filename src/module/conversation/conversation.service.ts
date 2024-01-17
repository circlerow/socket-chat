import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../../schema';
import { Model } from 'mongoose';
import { IInitConversation } from '../../share/interface/conversation.interface';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';
import { MessageService } from '../message/message.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  async getConversation(initConversation: IInitConversation) {
    const { user1Id, user2Id } = initConversation;
    const userIds = [user1Id, user2Id];
    return await this.conversationModel.findOne({
      userIds: { $all: userIds },
    });
  }

  @Cron('0 0 0 * * *')
  async handleCron() {
    await this.deleteAllMessageInConversation();
    this.logger.log('Delete all message');
  }

  async getAllConversation() {
    return await this.conversationModel.find();
  }

  async deleteAllMessageInConversation() {
    const conversations = await this.getAllConversation();
    await Promise.all(
      conversations.map(async (conversation) => {
        conversation.message = [];
        await conversation.save();
      }),
    );
  }

  async createConversation(initConversation: IInitConversation) {
    const { user1Id, user2Id } = initConversation;
    const id = randomUUID();

    await this.userService.updateConversationId(user1Id, id);
    await this.userService.updateConversationId(user2Id, id);

    return await this.conversationModel.create({
      id,
      userIds: [user1Id, user2Id],
    });
  }

  async getOrCreateConversation(initConversation: IInitConversation) {
    const conversation = await this.getConversation(initConversation);
    if (conversation) {
      return conversation;
    }
    return await this.createConversation(initConversation);
  }

  async getCurrent(userId: string, request: Request) {
    const myUserId = await this.userService.getUserId(request);

    const userIds = {
      user1Id: myUserId,
      user2Id: userId,
    };

    const conversation = await this.getOrCreateConversation(userIds);

    const messages = await Promise.all(
      conversation.message.map(async (message) => {
        let isMine = false;
        const { fromUserId, createdAt, messageId } = message;
        const messageContent =
          await this.messageService.getMessageById(messageId);
        if (messageContent.fromUserId === myUserId) isMine = true;
        return {
          content: messageContent.message,
          fromUserId,
          createdAt,
          from: messageContent.fromUserId,
          to: messageContent.toUserId,
          isMine,
        };
      }),
    );
    return { messages, conversationId: conversation.id };
  }

  async updateMessage(conversationId: string, message: any) {
    return await this.conversationModel.findOneAndUpdate(
      { id: conversationId },
      {
        $push: {
          message: {
            $each: [message],
            $position: 0,
          },
        },
      },
      { new: true },
    );
  }

  async updateLastMessage(conversationId: string, messageId: string) {
    const conversation = await this.conversationModel.findOne({
      id: conversationId,
    });
    conversation.lastMessage = messageId;
    await conversation.save();
  }

  async getAllUser(request: Request) {
    const userInfor = await this.userService.getInfoUser(request);
    const allUser = await this.userService.getAll(request);
    const conversationIds = await this.userService.getConversationIds(
      userInfor.id,
    );
    const allConversationId = await Promise.all(
      conversationIds.map(async (conversationId) => {
        return await this.conversationModel.findOne({ id: conversationId });
      }),
    );
    const users = allUser.map((user) => {
      let lastMessage = '';
      allConversationId.forEach((conversation) => {
        if (conversation.userIds.includes(user.id)) {
          lastMessage = conversation.lastMessage;
        }
      });
      return {
        id: user.id,
        name: user.name,
        lastMessage,
      };
    });

    return users;
  }
}
