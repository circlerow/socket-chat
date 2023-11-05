import { Body, Controller, Get, Post } from "@nestjs/common";
import { Message } from "../../schema";
import { MessageService } from "./message.service";

@Controller("message")
export class MessageController {
  constructor(
    private readonly messageService: MessageService
  ) {
  }

  @Post("create")
  createMessage(@Body() message: Message) {
    return this.messageService.createMessage(message);
  }

  @Get("get-by-conversation-id")
  getMessagesByConversationId(@Body("userConversationId") userConversationId: string) {
    return this.messageService.getMessagesByUserConversationId(userConversationId);
  }
}