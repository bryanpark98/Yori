import { Document, Query, Schema, model } from 'mongoose';
import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import applyVirtualIdHooks, { applyPopulateHooks } from './utils/schema_hooks';
import { ITable } from '@yori/types/src/core/table';

export interface IRestaurantDocument extends IRestaurantPrivate, Document {
  id: string;
}

export const restaurantSchema = new Schema<IRestaurantDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    hours: {
      type: [
        {
          opensAtMinutes: Number,
          closesAtMinutes: Number,
        },
      ],
      required: false,
    },
    adminToken: { type: String, required: true },
    menus: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Menu',
        },
      ],
      default: [],
    },
    imageUrl: { type: String },
    tables: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Table' }],
      default: [],
    },
  },
  { timestamps: true },
);

const populate = (query: Query<IRestaurantDocument, IRestaurantDocument>) => {
  query
    .populate({
      path: 'menus',
      populate: {
        path: 'menuSections',
        populate: {
          path: 'menuItems',
        },
      },
    })
    .populate({
      path: 'tables',
    });
};

applyVirtualIdHooks(restaurantSchema);
applyPopulateHooks(restaurantSchema, populate);

export const RestaurantModel = model<IRestaurantDocument>(
  'Restaurant',
  restaurantSchema,
);
