import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Facility extends Document {
  @Prop()
  name: string;
  @Prop()
  phone: string;
  @Prop()
  description: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
