import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserInfoDocument = UserInfo & Document;

@Schema({ timestamps: true })
export class UserInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  birthday: Date;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
