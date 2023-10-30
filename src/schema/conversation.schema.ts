import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userConversationId: string[];

  @Prop({ required: true })
  conversationId: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
