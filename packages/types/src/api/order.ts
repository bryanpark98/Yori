import { IOrder, OrderStatus } from "../core/order";

export type CreateOrderRequest = {
  items: {
    productId: string;
    quantity: number;
    options: {
      optionId: string;
      quantity: number;
    }[];
    specialInstructions?: string;
  }[];
};

export type CreateOrderResponse = {
  order: IOrder;
};

export type ChangeOrderStatusRequest = {
  status: OrderStatus;
};

export type ChangeOrderStatusResponse = {
  order: IOrder;
};

export type RequestOrderCancellationResponse = {
  order: IOrder;
};
