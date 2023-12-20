import { IMenu } from "../core/menu";
import { IOrder } from "../core/order";
import { IParty } from "../core/party";
import { IProduct } from "../core/product";
import { IRestaurantPrivate, IRestaurantPublic } from "../core/restaurant";
import { ITable } from "../core/table";
import { CreateMenuRequest, UpdateMenuRequest } from "./menu";
import { CreateTableRequest, UpdateTableRequest } from "./table";

export type CreateRestaurantRequest = {
  name: string;
  description: string;
  hours: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  }[];
};

export type CreateRestaurantResponse = {
  restaurant: IRestaurantPrivate;
};

export type ReadRestaurantPrivateResponse = {
  restaurant: IRestaurantPrivate;
};

export type ReadRestaurantPublicResponse = {
  restaurant: IRestaurantPublic;
};

export type UpdateRestaurantRequest = {
  id: string;
  name?: string;
  description?: string;
  hours?: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  }[];
  menus?: (CreateMenuRequest | UpdateMenuRequest)[];
  tables?: (CreateTableRequest | UpdateTableRequest)[];
  imageUrl?: string;
};

export type UpdateRestaurantResponse = {
  restaurant: IRestaurantPrivate;
};

export type ReadRestaurantProductsResponse = {
  products: IProduct[];
};

export type ReadRestaurantPartiesResponse = {
  parties: IParty[];
};
