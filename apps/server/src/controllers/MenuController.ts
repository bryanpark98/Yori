import {
  CreateMenuRequest,
  CreateMenuResponse,
  CreateMenuSectionRequest,
  CreateMenuSectionResponse,
  UpdateMenuRequest,
  UpdateMenuResponse,
  UpdateMenuSectionRequest,
  UpdateMenuSectionResponse,
} from '@yori/types/src/api/menu';
import { MenuService } from '../services/MenuService';
import { routeCreateOrUpdateRequest } from './utils/request_typing';
import { RestaurantService } from '../services/RestaurantService';

export class MenuController {
  public static async createMenu(
    request: CreateMenuRequest,
  ): Promise<CreateMenuResponse> {
    const newMenuSections = await Promise.all(
      request.menuSections.map((section) =>
        MenuService.createMenuSection({
          name: section.name,
          menuItemIds: section.menuItemIds,
        }),
      ),
    );

    const { name, deleted, published, restaurantId, hours } = request;
    const newMenu = await MenuService.createMenu({
      name,
      deleted,
      menuSectionIds: newMenuSections.map((section) => section.id),
      published,
      restaurantId,
      hours,
    });

    await RestaurantService.addMenuToRestaurant(restaurantId, newMenu.id);

    return { menu: newMenu };
  }

  public static async updateMenu(
    request: UpdateMenuRequest,
  ): Promise<UpdateMenuResponse> {
    const updatedMenuSections = await Promise.all(
      (request.menuSections || []).map((sectionRequest) =>
        routeCreateOrUpdateRequest(
          sectionRequest,
          MenuController.createMenuSection,
          MenuController.updateMenuSection,
        ),
      ),
    );

    const { id, deleted, name, published, restaurantId, hours } = request;
    const updatedMenu = await MenuService.updateMenu({
      id,
      deleted,
      name,
      menuSectionsIds: updatedMenuSections.map(
        (section) => section.menuSection.id,
      ),
      published,
      restaurantId,
      hours,
    });
    return { menu: updatedMenu };
  }

  public static async createMenuSection(
    request: CreateMenuSectionRequest,
  ): Promise<CreateMenuSectionResponse> {
    const { name, menuItemIds } = request;
    const newMenuSection = await MenuService.createMenuSection({
      name,
      menuItemIds,
    });
    return { menuSection: newMenuSection };
  }

  public static async updateMenuSection(
    request: UpdateMenuSectionRequest,
  ): Promise<UpdateMenuSectionResponse> {
    const { id, name, menuItemIds, deleted } = request;
    const updatedMenuSection = await MenuService.updateMenuSection({
      id,
      name,
      menuItemIds,
      deleted,
    });
    return { menuSection: updatedMenuSection };
  }
}
