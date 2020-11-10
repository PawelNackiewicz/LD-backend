import { Document } from 'mongoose';
import mongoose from "mongoose";

export interface TokenProps {
  readonly token: string;
  readonly userId: mongoose.Types.ObjectId;
  readonly expireAt: string;
}

export type IUserToken = TokenProps & Document;
