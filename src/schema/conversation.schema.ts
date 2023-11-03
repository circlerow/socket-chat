import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userConversationIds: string[];

  @Prop({ required: true })
  conversationId: string;

  @Prop({ required: true })
  userIds: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
