import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type InformationDocument = Information & Document;

@Schema({ timestamps: true })
export class Information {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  value: string;
}

export const InformationSchema = SchemaFactory.createForClass(Information);
