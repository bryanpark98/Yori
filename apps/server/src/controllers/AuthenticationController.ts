import {
  LoginResponse,
  LoginWithRestaurantTokenResponse,
  LoginWithRestaurantTokenRequest,
} from '@yori/types/src/api/authentication';
import { AuthenticationService } from '../services/AuthenticationService';
import { UserService } from '../services/UserService';
import { generateToken } from '../utils/token';

export class AuthenticationController {
  public static async loginWithRestaurantToken(
    req: LoginWithRestaurantTokenRequest,
  ): Promise<LoginWithRestaurantTokenResponse> {
    const restaurant = await AuthenticationService.loginWithRestaurantToken(
      req.restaurantToken,
    );

    return {
      restaurant,
      token: generateToken({ adminRestaurantId: restaurant.id }),
    };
  }

  public static async loginNewUser(): Promise<LoginResponse> {
    const user = await UserService.createUser({});
    return { user, token: generateToken({ userId: user.id }) };
  }
}
