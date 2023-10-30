import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessageSchema } from "../../schema";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Message",
        schema: MessageSchema,
        collection: "Message"
      }
    ])
  ],
  exports: [MongooseModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {
}