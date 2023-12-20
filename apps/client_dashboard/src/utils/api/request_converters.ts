import {
  CreateMenuRequest,
  CreateMenuSectionRequest,
  UpdateMenuRequest,
  UpdateMenuSectionRequest
} from '@yori/types/src/api/menu';
import {
  CreateProductOptionGroupRequest,
  CreateProductOptionRequest,
  CreateProductRequest,
  UpdateProductOptionGroupRequest,
  UpdateProductRequest
} from '@yori/types/src/api/product';
import { IMenu, IMenuSection } from '@yori/types/src/core/menu';
import { IProduct, IProductOption, IProductOptionGroup } from '@yori/types/src/core/product';
import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import { isTemporaryId } from '../id_util';
import { ITable } from '@yori/types/src/core/table';
import { CreateTableRequest, UpdateTableRequest } from '@yori/types/src/api/table';
import { CreateRestaurantRequest, UpdateRestaurantRequest } from '@yori/types/src/api/restaurant';

export class RequestConverter {
  public static getCreateRestaurantRequest(
    restaurant: IRestaurantPrivate
  ): CreateRestaurantRequest {
    return {
      name: restaurant.name,
      description: restaurant.description,
      hours: restaurant.hours
    };
  }
  public static getUpdateRestaurantRequest(
    restaurant: IRestaurantPrivate
  ): UpdateRestaurantRequest {
    return {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      hours: restaurant.hours,
      menus: restaurant.menus.map((menu) => {
        return RequestConverter.createOrUpdate(
          menu,
          RequestConverter.getCreateMenuRequest,
          RequestConverter.getUpdateMenuRequest
        );
      }),
      tables: restaurant.tables.map((table) => {
        return RequestConverter.createOrUpdate(
          table,
          RequestConverter.getCreateTableRequest,
          RequestConverter.getUpdateTableRequest
        );
      })
    };
  }

  public static getCreateProductRequest(product: IProduct): CreateProductRequest {
    return {
      name: product.name,
      dollarPrice: product.dollarPrice,
      restaurantId: product.restaurantId,
      description: product.description,
      imageUrl: product.imageUrl,
      options: product.options.map((option) =>
        RequestConverter.getCreateProductOptionGroupRequest(option)
      )
    };
  }
  public static getUpdateProductRequest(product: IProduct): UpdateProductRequest {
    return {
      id: product.id,
      name: product.name,
      dollarPrice: product.dollarPrice,
      restaurantId: product.restaurantId,
      description: product.description,
      imageUrl: product.imageUrl,
      options: product.options.map((options) =>
        RequestConverter.createOrUpdate(
          options,
          RequestConverter.getCreateProductOptionGroupRequest,
          RequestConverter.getUpdateProductOptionGroupRequest
        )
      )
    };
  }

  public static getCreateProductOptionGroupRequest(
    productOptionGroup: IProductOptionGroup
  ): CreateProductOptionGroupRequest {
    return {
      name: productOptionGroup.name,
      options: productOptionGroup.options.map((option) =>
        RequestConverter.getCreateProductOptionRequest(option)
      ),
      required: productOptionGroup.required,
      type: productOptionGroup.type
    };
  }
  public static getUpdateProductOptionGroupRequest(
    productOptionGroup: IProductOptionGroup
  ): UpdateProductOptionGroupRequest {
    return {
      id: productOptionGroup.id,
      name: productOptionGroup.name,
      options: productOptionGroup.options.map((option) => {
        return RequestConverter.createOrUpdate(
          option,
          RequestConverter.getCreateProductOptionRequest,
          RequestConverter.getUpdateProductOptionRequest
        );
      }),
      required: productOptionGroup.required,
      type: productOptionGroup.type
    };
  }

  public static getCreateProductOptionRequest(
    productOption: IProductOption
  ): CreateProductOptionRequest {
    return {
      name: productOption.name,
      dollarPrice: productOption.dollarPrice
    };
  }
  public static getUpdateProductOptionRequest(
    productOption: IProductOption
  ): CreateProductOptionRequest {
    return {
      name: productOption.name,
      dollarPrice: productOption.dollarPrice
    };
  }

  public static getCreateMenuSectionRequest(menuSection: IMenuSection): CreateMenuSectionRequest {
    return {
      name: menuSection.name,
      menuItemIds: menuSection.menuItems.map((item) => item.id)
    };
  }

  public static getUpdateMenuSectionRequest(menuSection: IMenuSection): UpdateMenuSectionRequest {
    return {
      id: menuSection.id,
      name: menuSection.name,
      menuItemIds: menuSection.menuItems.map((item) => item.id),
      deleted: menuSection.deleted
    };
  }

  public static getCreateMenuRequest(menu: IMenu): CreateMenuRequest {
    return {
      name: menu.name,
      menuSections: menu.menuSections.map((section) => {
        return {
          name: section.name,
          menuItemIds: section.menuItems.map((item) => item.id)
        };
      }),
      published: menu.published,
      restaurantId: menu.restaurantId,
      hours: menu.hours,
      deleted: menu.deleted
    };
  }

  public static getUpdateMenuRequest(menu: IMenu): UpdateMenuRequest {
    return {
      id: menu.id,
      name: menu.name,
      menuSections: menu.menuSections.map((section) => {
        return RequestConverter.createOrUpdate(
          section,
          RequestConverter.getCreateMenuSectionRequest,
          RequestConverter.getUpdateMenuSectionRequest
        );
      }),
      published: menu.published,
      restaurantId: menu.restaurantId,
      hours: menu.hours,
      deleted: menu.deleted
    };
  }

  public static getCreateTableRequest(table: ITable): CreateTableRequest {
    return {
      name: table.name,
      restaurantId: table.restaurantId
    };
  }

  public static getUpdateTableRequest(table: ITable): UpdateTableRequest {
    return {
      id: table.id,
      name: table.name
    };
  }

  private static createOrUpdate<T extends object, U, V>(
    request: T,
    create: (request: T) => U,
    update: (request: T) => V
  ): U | V {
    if ('id' in request && !isTemporaryId(request.id as string)) {
      return update(request);
    }
    return create(request);
  }
}
