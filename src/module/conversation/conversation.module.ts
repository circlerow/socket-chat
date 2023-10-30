import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationSchema } from "../../schema";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { UserConversationModule } from "../user-conversation/user-conversation.module";
import { UserConversationService } from "../user-conversation/user-conversation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Conversation",
        schema: ConversationSchema,
        collection: "Conversation"
      }
    ]),
    UserConversationModule
  ],
  exports: [MongooseModule],
  controllers: [ConversationController],
  providers: [ConversationService, UserConversationService]
})
export class ConversationModule {
}