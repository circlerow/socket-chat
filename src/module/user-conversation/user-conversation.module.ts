import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserConversationSchema } from "../../schema";
import { UserConversationService } from "./user-conversation.service";
import { UserConversationController } from "./user-conversation.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "UserConversation",
        schema: UserConversationSchema,
        collection: "UserConversation"
      }
    ])
  ],
  exports: [MongooseModule],
  controllers: [UserConversationController],
  providers: [UserConversationService]
})
export class UserConversationModule {
}