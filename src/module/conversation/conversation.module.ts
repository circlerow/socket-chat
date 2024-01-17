import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from '../../schema';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

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
  ],
  exports: [MongooseModule, ConversationService],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
