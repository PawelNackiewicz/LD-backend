import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  isActivated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
