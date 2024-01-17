import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConversationDocument = Conversation & Document;

export class MessageConversation {
  messageId: string;
  createdAt: Date;
  fromUserId: string;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  message: MessageConversation[];

  @Prop({ required: true })
  userIds: string[];

  @Prop()
  lastMessage?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
