import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  userConversationId: string;

  @Prop({ required: true })
  fromUserId: string;

  @Prop({ required: true })
  toUserId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
