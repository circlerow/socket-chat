import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from '../../schema';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserInfoModule } from '../user-info/user-info.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Conversation',
        schema: ConversationSchema,
        collection: 'Conversation',
      },
    ]),
    MessageModule,
    UserModule,
    ScheduleModule.forRoot(),
    UserInfoModule,
  ],
  exports: [MongooseModule, ConversationService],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
