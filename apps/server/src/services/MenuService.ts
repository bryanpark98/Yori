import { IMenu, IMenuSection } from '@yori/types/src/core/menu';
import { Types } from 'mongoose';
import { ApiError } from '../common/api_error';
import { MenuModel, MenuSectionModel } from '../models/MenuModel';
import { RestaurantModel } from '../models/RestaurantModel';

export class MenuService {
  public static async createMenu(menuData: {
    name: string;
    deleted: boolean;
    menuSectionIds: string[];
    published: boolean;
    restaurantId: string;
    hours: {
      opensAtMinutes: number;
      closesAtMinutes: number;
    };
  }): Promise<IMenu> {
    const { name, deleted, menuSectionIds, published, restaurantId, hours } =
      menuData;

    const restaurant = await RestaurantModel.findById(
      new Types.ObjectId(restaurantId),
    );
    if (!restaurant) {
      throw new ApiError('Restaurant not found', 404);
    }
    const newMenu = new MenuModel();

    newMenu.name = name;
    newMenu.deleted = deleted;
    newMenu.published = published;
    newMenu.hours = hours;
    newMenu.restaurantId = restaurantId;
    newMenu.set({ menuSections: menuSectionIds });

    await newMenu.save();
    return newMenu.toObject();
  }

  public static async updateMenu(menuData: {
    id: string;
    deleted?: boolean;
    name?: string;
    menuSectionsIds?: string[];
    published?: boolean;
    restaurantId?: string;
    hours?: {
      opensAtMinutes: number;
      closesAtMinutes: number;
    };
  }): Promise<IMenu> {
    const {
      id,
      deleted,
      name,
      menuSectionsIds,
      published,
      restaurantId,
      hours,
    } = menuData;

    const menu = await MenuModel.findById(new Types.ObjectId(id));
    if (!menu) {
      throw new ApiError('Menu not found', 404);
    }

    menu.name = name || menu.name;
    menu.deleted = deleted || menu.deleted;
    menu.published = published || menu.published;
    menu.hours = hours || menu.hours;
    menu.restaurantId = restaurantId || menu.restaurantId;
    menu.set({ menuSections: menuSectionsIds || menu.menuSections });

    await menu.save();
    return menu.toObject();
  }

  public static async createMenuSection(menuSectionData: {
    name: string;
    menuItemIds: string[];
  }): Promise<IMenuSection> {
    const { name, menuItemIds } = menuSectionData;

    const newMenuSection = new MenuSectionModel();
    newMenuSection.name = name;
    newMenuSection.set({ menuItems: menuItemIds });

    await newMenuSection.save();
    return newMenuSection.toObject();
  }

  public static async updateMenuSection(menuSectionData: {
    id: string;
    deleted?: boolean;
    name?: string;
    menuItemIds?: string[];
  }): Promise<IMenuSection> {
    const { id, deleted, name, menuItemIds } = menuSectionData;

    const menuSection = await MenuSectionModel.findById(new Types.ObjectId(id));
    if (!menuSection) {
      throw new ApiError('Menu section not found', 404);
    }
    menuSection.name = name || menuSection.name;
    menuSection.deleted = deleted || menuSection.deleted;
    menuSection.set({ menuItems: menuItemIds || menuSection.menuItems });

    await menuSection.save();
    return menuSection.toObject();
  }
}
