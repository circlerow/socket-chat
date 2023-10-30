import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserConversationDocument = UserConversation & Document;

@Schema({ timestamps: true })
export class UserConversation {
  @Prop({ required: true })
  messageId?: string[];

  @Prop({ required: true })
  conversationId: string;

  @Prop({ required: true })
  userId: string;
}

export const UserConversationSchema = SchemaFactory.createForClass(UserConversation);
