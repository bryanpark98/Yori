import { IRestaurantPrivate } from "../core/restaurant";
import { IUserPrivate } from "../core/user";

export type LoginWithRestaurantTokenRequest = {
  restaurantToken: string;
};

export type LoginWithRestaurantTokenResponse = {
  restaurant: IRestaurantPrivate;
  token: string;
};

export type LoginResponse = {
  user: IUserPrivate;
  token: string;
};
