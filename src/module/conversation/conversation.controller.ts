import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  createConversation(@Body('conversationId') conversationId: string) {
    return this.conversationService.createConversation(conversationId);
  }
}
