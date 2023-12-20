import { IMenu } from "./menu";
import { ITable } from "./table";

export interface IRestaurantPublic {
  id: string;
  name: string;
  description: string;
  hours: {
    opensAtMinutes: number;
    closesAtMinutes: number;
  }[];
  menus: IMenu[];
  tables: ITable[];
  imageUrl?: string;
}

export interface IRestaurantPrivate extends IRestaurantPublic {
  adminToken: string;
}
