import { IUserPrivate } from '@yori/types/src/core/user';
import { UserModel } from '../models/UserModel';
import convert from 'color-convert';
import { ImageStorageManager } from '../utils/ImageStorageManager';

export class UserService {
  public static async createUser(userData: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }): Promise<IUserPrivate> {
    const { firstName, lastName } = userData;
    const user = new UserModel();
    user.firstName = firstName;
    user.lastName = lastName;
    user.colorHex = convert.hsv.hex([Math.random() * 360, 70, 100]);
    user.imageUrl = await ImageStorageManager.getRandomProfilePicture();
    await user.save();
    return user.toObject();
  }
}
