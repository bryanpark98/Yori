import { sign } from 'jsonwebtoken';
import { IUserDocument, User } from '../models/user';
import { compare, hash } from 'bcrypt';
import config from '../utils/config';
import { ApiError } from '../common/api_error';
import { LoginRequest, SignupRequest } from '@yori/types/api/user';
import { TokenData, TokenPayload } from '../utils/types';
import { Restaurant } from '../models/restaurant';

export class AuthenticationService {
  public static async login(req: LoginRequest) {
    const user = await User.findOne({ email: req.email });
    if (!user) throw new ApiError('User not found', 404);

    const loginSucceeded = await this.validatePassword(user, req.password);
    if (!loginSucceeded) throw new ApiError("Password doesn't match", 401);

    return { user, token: this.generateToken({ userId: user.id }) };
  }

  public static async loginWithRestaurantToken(token: string) {
    const restaurant = await Restaurant.findOne({ adminToken: token });
    if (!restaurant) throw new ApiError('Restaurant not found', 404);

    return {
      restaurant,
      token: this.generateToken({ adminRestaurantId: restaurant.id }),
    };
  }

  public static async createDefaultUser() {
    const user = await new User().save();
    return { user, token: this.generateToken({ userId: user.id }) };
  }

  public static async signup(req: SignupRequest) {
    const user = await User.create({
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      passwordHash: await this.hashPassword(req.password),
    });

    return { user, token: this.generateToken({ userId: user.id }) };
  }

  private static async hashPassword(password: string) {
    return await hash(password, 10);
  }

  private static async validatePassword(
    user: IUserDocument,
    password: string,
  ): Promise<boolean> {
    if (user.passwordHash === undefined) return false;
    return await compare(password, user.passwordHash);
  }

  private static generateToken(data: TokenData): string {
    const tokenPayload: TokenPayload = { time: Date(), data };
    return sign(tokenPayload, config.jwtSecret);
  }
}
