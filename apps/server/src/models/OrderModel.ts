import { IOrder, IOrderItem, OrderStatus } from '@yori/types/src/core/order';
import { app } from 'firebase-admin';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import applyVirtualIdHooks, {
  applyPopulateHooks,
  applyVirtualReferenceIdHooks,
} from './utils/schema_hooks';

interface OrderDocument extends IOrder, Document {
  id: string;
  restaurantObjectId: Types.ObjectId;
  partyObjectId: Types.ObjectId;
}
const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
      },
    ],
    restaurantObjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    partyObjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Party',
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
  },
  { timestamps: true },
);
const populate = (query: mongoose.Query<OrderDocument, OrderDocument>) => {
  query
    .populate({
      path: 'items',
      populate: {
        path: 'product',
      },
    })
    .populate({
      path: 'items',
      populate: {
        path: 'options',
        populate: {
          path: 'option',
        },
      },
    })
    .populate({
      path: 'user',
    });
};
applyVirtualIdHooks(orderSchema);
applyPopulateHooks(orderSchema, populate);
applyVirtualReferenceIdHooks(orderSchema, 'restaurantObjectId', 'restaurantId');
applyVirtualReferenceIdHooks(orderSchema, 'partyObjectId', 'partyId');
export const OrderModel: Model<OrderDocument> = mongoose.model<OrderDocument>(
  'Order',
  orderSchema,
);

interface OrderItemDocument extends IOrderItem, Document {
  id: string;
}
const orderItemSchema = new mongoose.Schema<OrderItemDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    options: [
      {
        option: {
          type: Schema.Types.ObjectId,
          ref: 'ProductOption',
        },
        quantity: Number,
      },
    ],
    specialInstructions: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);
applyVirtualIdHooks(orderItemSchema);
export const OrderItemModel: Model<OrderItemDocument> =
  mongoose.model<OrderItemDocument>('OrderItem', orderItemSchema);
