import { Body, Controller, Post } from "@nestjs/common";
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
}