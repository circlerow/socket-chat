import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../../schema';
import { Model } from 'mongoose';
import { UserConversationService } from '../user-conversation/user-conversation.service';
import { IInitConversation } from './conversation.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    private readonly userConversationService: UserConversationService,
    private readonly userService: UserService,
  ) {}

  async getUserConversations(conversationId: string) {
    return await this.userConversationService.get(conversationId);
  }

  async createConversation(conversationId: string) {
    const userConversation = await this.getUserConversations(conversationId);
    const userConversationIds = userConversation.map(
      (userConversation) => userConversation.id,
    );
    const userIds = userConversation.map(
      (userConversation) => userConversation.userId,
    );
    const conversation = {
      conversationId,
      userConversationIds: userConversationIds,
      userIds: userIds,
    };
    return await this.conversationModel.create(conversation);
  }

  async findConversationById(id: string) {
    return this.conversationModel.findById(id);
  }

  async checkOrCreateConversation(initConversation: IInitConversation) {
    const { conversationId, user1Id, user2Id } = initConversation;
    const usersId = [user1Id, user2Id];
    const existConversation = await this.conversationModel.findOne({
      userIds: { $all: usersId },
    });
    const user1Conversation = {
      conversationId,
      userId: user1Id,
    };
    const user2Conversation = {
      conversationId,
      userId: user2Id,
    };
    if (!existConversation) {
      const user1ConversatinId =
        await this.userConversationService.createUsersConversation(
          user1Conversation,
        );
      const user2ConversatinId =
        await this.userConversationService.createUsersConversation(
          user2Conversation,
        );
      const userConversationIds = [
        user1ConversatinId.id,
        user2ConversatinId.id,
      ];
      await this.userService.updateUserConversationId(
        user1Id,
        userConversationIds[0],
      );
      await this.userService.updateUserConversationId(
        user2Id,
        userConversationIds[1],
      );
      return await this.conversationModel.create({
        conversationId,
        userConversationIds,
        userIds: usersId,
      });
    }
    return existConversation;
  }
}
