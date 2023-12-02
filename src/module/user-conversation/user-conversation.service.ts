import { Injectable } from '@nestjs/common';
import { UserConversation } from '../../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageService } from '../message/message.service';
import { InitConversationDto } from 'src/share/dto/init-conversation.dto';

@Injectable()
export class UserConversationService {
  constructor(
    @InjectModel(UserConversation.name)
    private readonly userConversationModel: Model<UserConversation>,
    private readonly messageService: MessageService,
  ) {}

  async createUsersConversation(
    initConversation: InitConversationDto,
  ): Promise<string> {
    const userConversation = await this.userConversationModel.create({
      ...initConversation,
      messageId: [],
    });
    return userConversation._id.toString();
  }

  async updateLastMessageId(userConversationId: string, lastMessageId: string) {
    const updateMessageId = this.userConversationModel.findByIdAndUpdate(
      userConversationId,
      { $push: { messageId: { $each: [lastMessageId], $position: 0 } } },
      { new: true },
    );
    if (!updateMessageId) {
      console.log(
        `Can't update last message id for user conversation ${userConversationId}`,
      );
      return null;
    }
    return updateMessageId;
  }

  async getMessage(userConversationId: string) {
    const userConversation =
      await this.userConversationModel.findById(userConversationId);
    const messageIds = userConversation.messageId;

    const messagePromises = messageIds.map(async (messageId) => {
      return await this.messageService.getMessageById(messageId);
    });
    const messages = await Promise.all(messagePromises);

    return messages;
  }
}
