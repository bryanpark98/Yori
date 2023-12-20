import { IOrder } from "./order";
import { IRestaurantPublic } from "./restaurant";
import { ITable } from "./table";
import { IUserPublic } from "./user";

export interface IParty {
  id: string;
  users: IUserPublic[];
  orders: IOrder[];
  table: ITable;
  createdAt: string;
  closedAt?: string;
}
