import { Body, Controller, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('current-conversation')
  getCurrentConversation(
    @Body('userId') userId: string,
    @Req() request: Request,
  ) {
    return this.conversationService.getCurrent(userId, request);
  }
}
