import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { IInitConversation } from './conversation.interface';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('init')
  checkOrCreateConversation(@Body() initConversation: IInitConversation) {
    return this.conversationService.checkOrCreateConversation(initConversation);
  }

  @Post('create')
  createConversation(@Body('conversationId') conversationId: string) {
    return this.conversationService.createConversation(conversationId);
  }
}
