import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserConversationService } from "./user-conversation.service";
import { UserConversation } from "../../schema";
import { InitConversationDto } from "./dto/init-conversation.dto";

@Controller("user-conversation")
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService
  ) {
  }

  @Post("create")
  createUserConversation(@Body() initUserConversation: InitConversationDto) {
    return this.userConversationService.createUsersConversation(initUserConversation);
  }

  @Get("get-messages-id")
  getMessageIdByUserConversation(@Body("userConversationId") userConversationId: string) {
    return this.userConversationService.getMessage(userConversationId);
  }

  @Get("get-messages-content")
  getMessageContentByUserConversation(@Body("userConversationId") userConversationId: string) {
    return this.userConversationService.getMessageContent(userConversationId);
  }

}