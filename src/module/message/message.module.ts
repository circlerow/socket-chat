import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../../schema';
import { MessageService } from './message.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
        collection: 'Message',
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  exports: [MongooseModule, MessageService],
  providers: [MessageService],
})
export class MessageModule {}
