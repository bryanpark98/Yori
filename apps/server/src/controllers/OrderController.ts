import {
  ChangeOrderStatusRequest,
  ChangeOrderStatusResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  RequestOrderCancellationResponse,
} from '@yori/types/src/api/order';
import { OrderService } from '../services/OrderService';

export class OrderController {
  public static async createOrder(
    userId: string,
    partyId: string,
    request: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    const newOrder = await OrderService.createOrder({
      ...request,
      userId,
      partyId,
    });
    return { order: newOrder };
  }

  /**
   * Requests the cancellation of an order (should only be used by the user)
   * @param orderId id of the order to cancel
   * @returns the updated order
   */
  public static async requestOrderCancellation(
    orderId: string,
    userId: string,
  ): Promise<RequestOrderCancellationResponse> {
    const order = await OrderService.requestOrderCancellation(orderId, userId);
    return { order };
  }

  /**
   * Changes the status of an order (should only be used by the restaurant)
   * @param orderId id of the order to change
   * @param status new status of the order
   * @returns the updated order
   */
  public static async changeOrderStatus(
    orderId: string,
    request: ChangeOrderStatusRequest,
  ): Promise<ChangeOrderStatusResponse> {
    const order = await OrderService.changeOrderStatus(orderId, request.status);
    return { order };
  }
}
