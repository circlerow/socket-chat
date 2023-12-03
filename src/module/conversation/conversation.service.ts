import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../../schema';
import { Model } from 'mongoose';
import { UserConversationService } from '../user-conversation/user-conversation.service';
import { IInitConversation } from '../../share/interface/conversation.interface';
import { UserService } from '../user/user.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    private readonly userConversationService: UserConversationService,
    private readonly userService: UserService,
  ) {}

  async getConversation(initConversation: IInitConversation) {
    const { user1Id, user2Id } = initConversation;
    const usersId = [user1Id, user2Id];
    return await this.conversationModel.findOne({
      userIds: { $all: usersId },
    });
  }

  async createConversation(initConversation: IInitConversation) {
    const { user1Id, user2Id } = initConversation;
    const conversationId = randomUUID();
    const user1ConversationId =
      await this.userConversationService.createUsersConversation({
        conversationId,
        userId: user1Id,
      });
    const user2ConversationId =
      await this.userConversationService.createUsersConversation({
        conversationId,
        userId: user2Id,
      });
    await this.userService.updateUserConversationId(
      user1Id,
      user1ConversationId,
    );
    await this.userService.updateUserConversationId(
      user2Id,
      user2ConversationId,
    );
    return await this.conversationModel.create({
      conversationId,
      userConversationIds: [user1ConversationId, user2ConversationId],
      userIds: [user1Id, user2Id],
    });
  }

  async checkOrCreateConversation(initConversation: IInitConversation) {
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
    const conversation = await this.checkOrCreateConversation(userIds);
    let user1Conversation = conversation.userConversationIds[0];
    let user2Conversation = conversation.userConversationIds[1];
    if (userIds.user1Id === conversation.userIds[1]) {
      user1Conversation = conversation.userConversationIds[1];
      user2Conversation = conversation.userConversationIds[0];
    }
    const user1Messages =
      await this.userConversationService.getMessage(user1Conversation);
    const user2Messages =
      await this.userConversationService.getMessage(user2Conversation);
    const myMessage = user1Messages.map((message) => {
      return {
        message: message.message,
        time: message.createdAt,
        fromUserId: message.fromUserId,
        toUserId: message.toUserId,
        isMine: true,
      };
    });
    const yourMessage = user2Messages.map((message) => {
      return {
        message: message.message,
        time: message.createdAt,
        fromUserId: message.fromUserId,
        toUserId: message.toUserId,
        isMine: false,
      };
    });
    const messages = [...myMessage, ...yourMessage];
    messages.sort((a, b) => {
      return b.time - a.time;
    });
    return {
      conversationId: user1Conversation,
      messages: messages,
    };
  }
}
