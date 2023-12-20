import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
} from '@yori/types/src/api/restaurant';
import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import { RestaurantModel } from '../models/RestaurantModel';
import { Types } from 'mongoose';
import { ApiError } from '../common/api_error';
import { ProductModel } from '../models/ProductModel';
import { IProduct } from '@yori/types/src/core/product';

export class RestaurantService {
  public static async createRestaurant(restaurantData: {
    name: string;
    description?: string;
    hours: {
      opensAtMinutes: number;
      closesAtMinutes: number;
    }[];
    menuIds: string[];
  }): Promise<IRestaurantPrivate> {
    const { name, description, hours, menuIds } = restaurantData;

    const newRestaurant = new RestaurantModel();
    newRestaurant.name = name;
    newRestaurant.description = description || '';
    newRestaurant.hours = hours;
    newRestaurant.set({ menus: menuIds });

    await newRestaurant.save();
    return newRestaurant.toObject();
  }

  public static async updateRestaurant(restaurantData: {
    id: string;
    name?: string;
    description?: string;
    hours?: {
      opensAtMinutes: number;
      closesAtMinutes: number;
    }[];
    menuIds?: string[];
    tableIds?: string[];
    imageUrl?: string;
  }) {
    const { id, name, description, hours, menuIds, imageUrl, tableIds } =
      restaurantData;

    const restaurant = await RestaurantModel.findById(new Types.ObjectId(id));
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.hours = hours || restaurant.hours;
    restaurant.imageUrl = imageUrl || restaurant.imageUrl;
    restaurant.set({ tables: tableIds || restaurant.tables });
    restaurant.set({ menus: menuIds || restaurant.menus });

    await restaurant.save();
    return restaurant.toObject();
  }

  public static async readRestaurantPublic(restaurantId: string) {
    const restaurant = await RestaurantModel.findById(
      new Types.ObjectId(restaurantId),
    );
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    return restaurant.toObject();
  }

  public static async readRestaurantPrivate(
    restaurantId: string,
  ): Promise<IRestaurantPrivate> {
    const restaurant = await RestaurantModel.findById(
      new Types.ObjectId(restaurantId),
    );
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    return restaurant.toObject();
  }

  public static async readProducts(restaurantId: string): Promise<IProduct[]> {
    const products = await ProductModel.find({
      restaurantObjectId: new Types.ObjectId(restaurantId),
    }).sort({ updatedAt: 'desc' });
    return products;
  }

  public static async addMenuToRestaurant(
    restaurantId: string,
    menuId: string,
  ) {
    const restaurant = await RestaurantModel.findById(
      new Types.ObjectId(restaurantId),
    );
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    restaurant.set({ menus: [...restaurant.menus, menuId] });
    await restaurant.save();
    return restaurant.toObject();
  }

  public static async getRestaurantById(restaurantId: string) {
    const restaurant = await RestaurantModel.findById(
      new Types.ObjectId(restaurantId),
    );
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    return restaurant.toObject();
  }
}
