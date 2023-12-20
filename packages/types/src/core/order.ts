import { IParty } from "./party";
import { IProduct, IProductOption } from "./product";
import { ITable } from "./table";
import { IUserPublic } from "./user";

export interface IOrder {
  id: string;
  user: IUserPublic;
  partyId: string;
  restaurantId: string;
  items: IOrderItem[];
  status: OrderStatus;
  createdAt: string;
}

export enum OrderStatus {
  Pending = "PENDING",
  CancellationRequested = "CANCELLATION REQUESTED",
  CancellationRejected = "CANCELLATION REJECTED",
  Preparing = "PREPARING",
  Ready = "READY",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export interface IOrderItem {
  id: string;
  product: IProduct;
  quantity: number;
  options: ISelectedProductOption[];
  specialInstructions?: string;
}

export interface ISelectedProductOption {
  option: IProductOption;
  quantity: number;
}
