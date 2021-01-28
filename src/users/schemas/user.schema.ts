import * as mongoose from 'mongoose';
import { statusEnum } from '../enums/status';
import { roleEnum } from '../enums/role';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(statusEnum),
    default: statusEnum.pending,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  roles: { type: [String], required: true, enum: Object.values(roleEnum) },
  password: { type: String, required: true },
  marketingPermissions: { type: Boolean, default: true },
});

UserSchema.index({ email: 1 }, { unique: true });
