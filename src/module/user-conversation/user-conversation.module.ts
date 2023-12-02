import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConversationSchema } from '../../schema';
import { UserConversationService } from './user-conversation.service';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserConversation',
        schema: UserConversationSchema,
        collection: 'UserConversation',
      },
    ]),
    MessageModule,
  ],
  exports: [MongooseModule, UserConversationService],
  providers: [UserConversationService],
})
export class UserConversationModule {}
