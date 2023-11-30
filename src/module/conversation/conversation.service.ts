import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from '../../schema';
import { Model } from 'mongoose';
import { UserConversationService } from '../user-conversation/user-conversation.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    private readonly userConversationService: UserConversationService,
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
}
