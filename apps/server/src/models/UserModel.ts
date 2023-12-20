import { Document, Schema, model } from 'mongoose';
import { IUserPrivate } from '@yori/types/src/core/user';
import applyVirtualIdHooks from './utils/schema_hooks';

export interface IUserDocument extends IUserPrivate, Document {
  id: string;
}
export const userSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    token: { type: Number, required: false },
    imageUrl: { type: String, required: false },
    colorHex: { type: String, required: false },
  },
  { timestamps: true },
);
applyVirtualIdHooks(userSchema);
export const UserModel = model<IUserDocument>('User', userSchema);
