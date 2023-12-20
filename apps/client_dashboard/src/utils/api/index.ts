import { CreateMenuResponse, UpdateMenuResponse } from '@yori/types/src/api/menu';
import { CreateProductResponse, UpdateProductResponse } from '@yori/types/src/api/product';
import {
  ReadRestaurantPrivateResponse,
  ReadRestaurantProductsResponse
} from '@yori/types/src/api/restaurant';
import { IMenu } from '@yori/types/src/core/menu';
import { IProduct } from '@yori/types/src/core/product';
import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import apiClient from './apiClient';
import { RequestConverter } from './request_converters';
import {
  LoginWithRestaurantTokenResponse,
  LoginWithRestaurantTokenRequest
} from '@yori/types/src/api/authentication';

export const Authentication = {
  loginWithRestaurantToken: async (
    restaurantToken: string
  ): Promise<LoginWithRestaurantTokenResponse> => {
    const response = await apiClient.post(`/authentication/login/restaurant-token`, {
      request: { restaurantToken } as LoginWithRestaurantTokenRequest
    });
    return response.data as LoginWithRestaurantTokenResponse;
  }
};

export const Restaurant = {
  readPrivate: async (restaurantId: string): Promise<ReadRestaurantPrivateResponse> => {
    const response = await apiClient.get(`/restaurants/${restaurantId}/private`);
    return response.data as ReadRestaurantPrivateResponse;
  },
  readProducts: async (restaurantId: string): Promise<ReadRestaurantProductsResponse> => {
    const response = await apiClient.get(`/restaurants/${restaurantId}/products`);
    return response.data as ReadRestaurantProductsResponse;
  },
  update: async (restaurant: IRestaurantPrivate, image?: File): Promise<UpdateMenuResponse> => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    formData.append(
      'request',
      JSON.stringify(RequestConverter.getUpdateRestaurantRequest(restaurant))
    );

    const response = await apiClient.put(`/restaurants/${restaurant.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data as UpdateMenuResponse;
  }
};

export const Menu = {
  create: async (menu: IMenu): Promise<CreateMenuResponse> => {
    const response = await apiClient.post(`/restaurants/${menu.restaurantId}/menus`, {
      request: RequestConverter.getCreateMenuRequest(menu)
    });
    return response.data as CreateMenuResponse;
  },
  update: async (menu: IMenu): Promise<UpdateMenuResponse> => {
    const response = await apiClient.put(`/restaurants/${menu.restaurantId}/menus/${menu.id}`, {
      request: RequestConverter.getUpdateMenuRequest(menu)
    });
    return response.data as UpdateMenuResponse;
  }
};

export const Product = {
  create: async (product: IProduct, image?: File): Promise<CreateProductResponse> => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    formData.append('request', JSON.stringify(RequestConverter.getCreateProductRequest(product)));

    const response = await apiClient.post(
      `/restaurants/${product.restaurantId}/products`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data as CreateProductResponse;
  },
  update: async (product: IProduct, image?: File): Promise<UpdateProductResponse> => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    formData.append('request', JSON.stringify(RequestConverter.getUpdateProductRequest(product)));

    const response = await apiClient.put(
      `/restaurants/${product.restaurantId}/products/${product.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data as UpdateProductResponse;
  }
};
