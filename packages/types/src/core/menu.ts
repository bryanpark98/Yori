import { IProduct } from "./product";

export interface IMenu {
  id: string;
  name: string;
  menuSections: IMenuSection[];
  published: boolean;
  restaurantId: string;
  hours: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  };
  deleted: boolean;
}

export interface IMenuSection {
  id: string;
  name: string;
  menuItems: IProduct[];
  deleted: boolean;
}
