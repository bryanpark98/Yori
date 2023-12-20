import {
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  ReadRestaurantPartiesResponse,
  ReadRestaurantPrivateResponse,
  ReadRestaurantProductsResponse,
  ReadRestaurantPublicResponse,
  UpdateRestaurantRequest,
  UpdateRestaurantResponse,
} from '@yori/types/src/api/restaurant';
import { PartyService } from '../services/PartyService';
import { RestaurantService } from '../services/RestaurantService';
import { ImageStorageManager } from '../utils/ImageStorageManager';
import { MenuController } from './MenuController';
import { TableController } from './TableController';
import { routeCreateOrUpdateRequest } from './utils/request_typing';
import { IParty } from '@yori/types/src/core/party';
import { ApiError } from '@google-cloud/storage';

export class RestaurantController {
  public static async create(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse> {
    const { name, description, hours } = request;
    const newRestaurant = await RestaurantService.createRestaurant({
      name,
      description,
      hours,
      menuIds: [], // TODO: implement?
    });
    return { restaurant: newRestaurant };
  }

  public static async readPublic(
    restaurandId: string,
  ): Promise<ReadRestaurantPublicResponse> {
    const restaurant = await RestaurantService.readRestaurantPublic(
      restaurandId,
    );
    return { restaurant };
  }

  public static async readPrivate(
    restaurandId: string,
  ): Promise<ReadRestaurantPrivateResponse> {
    const restaurant = await RestaurantService.readRestaurantPrivate(
      restaurandId,
    );
    return { restaurant };
  }

  public static async update(
    request: UpdateRestaurantRequest,
    image?: Express.Multer.File,
  ): Promise<UpdateRestaurantResponse> {
    const imageUrl = image
      ? await ImageStorageManager.upload(image, 'restaurants')
      : request.imageUrl;
    const { id, name, description, hours, menus } = request;

    const menuIds = await Promise.all(
      (menus || []).map(async (menuRequest) => {
        const response = await routeCreateOrUpdateRequest(
          menuRequest,
          MenuController.createMenu,
          MenuController.updateMenu,
        );
        return response.menu.id;
      }),
    );

    const tableIds = await Promise.all(
      (request.tables || []).map(async (tableRequest) => {
        const response = await routeCreateOrUpdateRequest(
          tableRequest,
          TableController.createTable,
          TableController.updateTable,
        );
        return response.table.id;
      }),
    );

    const restaurant = await RestaurantService.updateRestaurant({
      id,
      name,
      description,
      hours,
      menuIds,
      imageUrl,
      tableIds,
    });
    return { restaurant };
  }

  public static async readProducts(
    restaurandId: string,
  ): Promise<ReadRestaurantProductsResponse> {
    const products = await RestaurantService.readProducts(restaurandId);
    return { products };
  }

  public static async readActiveParties(
    restaurantId: string,
  ): Promise<ReadRestaurantPartiesResponse> {
    const restaurant = await RestaurantService.readRestaurantPrivate(
      restaurantId,
    );
    const unfilteredParties: (IParty | null)[] = await Promise.all(
      restaurant.tables.map(async (table) => {
        try {
          return await PartyService.readPartyByTableId(table.id);
        } catch (err) {
          const e = err as ApiError;
          if (e.message === 'Party not found') return null;
          throw e;
        }
      }),
    );
    const parties = unfilteredParties.filter((p) => p !== null) as IParty[];
    return { parties };
  }
}
