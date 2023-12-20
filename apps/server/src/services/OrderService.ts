import { IOrder, IOrderItem, OrderStatus } from '@yori/types/src/core/order';
import { OrderItemModel, OrderModel } from '../models/OrderModel';
import { PartyModel } from '../models/PartyModel';
import { Types } from 'mongoose';
import { UserModel } from '../models/UserModel';
import { getIo } from '../socket/socketManager';

export class OrderService {
  public static async createOrder(orderData: {
    userId: string;
    partyId: string;
    items: {
      productId: string;
      quantity: number;
      options: {
        optionId: string;
        quantity: number;
      }[];
      specialInstructions?: string;
    }[];
  }): Promise<IOrder> {
    const { items, userId, partyId } = orderData;

    const party = await PartyModel.findById(new Types.ObjectId(partyId));
    if (!party) throw new Error('Party not found');

    const newOrder = new OrderModel();
    newOrder.items = await Promise.all(
      items.map(async (item) => {
        const newItem = new OrderItemModel();
        newItem.quantity = item.quantity;
        newItem.specialInstructions = item.specialInstructions;
        newItem.set({ product: item.productId });
        newItem.set({
          options: item.options.map((option) => ({
            option: option.optionId,
            quantity: option.quantity,
          })),
        });
        await newItem.save();
        return newItem;
      }),
    );
    const user = await UserModel.findById(new Types.ObjectId(userId));
    if (!user) throw new Error('User not found');
    newOrder.user = user;
    await newOrder.save();

    party.set({ orders: [newOrder, ...party.orders] });
    await party.save();

    // getIo().of('/order').emit('newOrder', newOrder.toObject());

    return newOrder.toObject();
  }

  public static async requestOrderCancellation(
    orderId: string,
    userId: string,
  ): Promise<IOrder> {
    const order = await OrderModel.findById(new Types.ObjectId(orderId));
    if (!order) throw new Error('Order not found');
    if (order.user?.id !== userId) {
      throw new Error('Cannot cancel an order that is not yours');
    }
    if (order.status !== OrderStatus.Pending) {
      throw new Error(`Cannot cancel an order that is ${order.status}}`);
    }
    order.status = OrderStatus.CancellationRequested;
    await order.save();
    return order.toObject();
  }

  public static async changeOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<IOrder> {
    const order = await OrderModel.findById(new Types.ObjectId(orderId));
    if (!order) throw new Error('Order not found');
    order.status = status;
    await order.save();
    return order.toObject();
  }
}
