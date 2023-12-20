import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import { ApiError } from '../common/api_error';
import { RestaurantModel } from '../models/RestaurantModel';
import { generateToken } from '../utils/token';

export class AuthenticationService {
  public static async loginWithRestaurantToken(
    token: string,
  ): Promise<IRestaurantPrivate> {
    const restaurant = await RestaurantModel.findOne({ adminToken: token });
    if (!restaurant) throw new ApiError('Restaurant not found', 404);

    return restaurant;
  }
}
