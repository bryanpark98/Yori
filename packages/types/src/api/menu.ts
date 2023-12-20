import { IMenu, IMenuSection } from "../core/menu";

export type CreateMenuRequest = {
  name: string;
  menuSections: CreateMenuSectionRequest[];
  published: boolean;
  restaurantId: string;
  hours: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  };
  deleted: boolean;
};

export type CreateMenuResponse = {
  menu: IMenu;
};

export type UpdateMenuRequest = {
  id: string;
  name?: string;
  menuSections?: (CreateMenuSectionRequest | UpdateMenuSectionRequest)[];
  published?: boolean;
  restaurantId?: string;
  hours?: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  };
  deleted?: boolean;
};

export type UpdateMenuResponse = {
  menu: IMenu;
};

export type CreateMenuSectionRequest = {
  name: string;
  menuItemIds: string[];
};

export type CreateMenuSectionResponse = {
  menuSection: IMenuSection;
};

export type UpdateMenuSectionRequest = {
  id: string;
  name?: string;
  menuItemIds?: string[];
  deleted?: boolean;
};

export type UpdateMenuSectionResponse = {
  menuSection: IMenuSection;
};
