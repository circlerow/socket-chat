import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserConversationSchema } from "../../schema";
import { UserConversationService } from "./user-conversation.service";
import { UserConversationController } from "./user-conversation.controller";
import { UserModule } from "../user/user.module";
import { MessageModule } from "../message/message.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "UserConversation",
        schema: UserConversationSchema,
        collection: "UserConversation"
      }
    ]),
    MessageModule
  ],
  exports: [MongooseModule, UserConversationService],
  controllers: [UserConversationController],
  providers: [UserConversationService]
})
export class UserConversationModule {
}