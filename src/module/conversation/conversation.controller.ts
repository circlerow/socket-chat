import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthenticationGuard } from '../auth/guard/auth.guard';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('all-user')
  @UseGuards(AuthenticationGuard)
  getAllUser(@Req() request: Request) {
    return this.conversationService.getAllUser(request);
  }

  @Get(':userId')
  @UseGuards(AuthenticationGuard)
  getCurrentConversation(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    return this.conversationService.getCurrent(userId, request);
  }
}
