import { CallbackError, Document, Query, Schema, Types, model } from 'mongoose';
import {
  IProduct,
  IProductOption,
  IProductOptionGroup,
} from '@yori/types/src/core/product';
import applyVirtualIdHooks, {
  applyPopulateHooks,
  applyVirtualReferenceIdHooks,
} from './utils/schema_hooks';

export interface IProductOptionDocument extends IProductOption, Document {
  id: string;
}
export const productOptionSchema = new Schema<IProductOptionDocument>(
  {
    name: { type: String, required: true },
    dollarPrice: { type: Number, required: true },
  },
  { timestamps: true },
);
applyVirtualIdHooks(productOptionSchema);
export const ProductOptionModel = model<IProductOptionDocument>(
  'ProductOption',
  productOptionSchema,
);

export interface IProductOptionGroupDocument
  extends IProductOptionGroup,
    Document {
  id: string;
}
export const productOptionGroupSchema = new Schema<IProductOptionGroupDocument>(
  {
    name: { type: String, required: true },
    options: [{ type: Schema.Types.ObjectId, ref: 'ProductOption' }],
    required: { type: Boolean, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true },
);
applyVirtualIdHooks(productOptionGroupSchema);
export const ProductOptionGroupModel = model<IProductOptionGroupDocument>(
  'ProductOptionGroup',
  productOptionGroupSchema,
);

export interface IProductDocument extends IProduct, Document {
  id: string;
  restaurantObjectId: Types.ObjectId;
}
export const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    dollarPrice: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    restaurantObjectId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    options: [{ type: Schema.Types.ObjectId, ref: 'ProductOptionGroup' }],
  },
  { timestamps: true },
);
const populate = (query: Query<IProductDocument, IProductDocument>) => {
  query.populate({
    path: 'options',
    populate: {
      path: 'options',
    },
  });
};
applyPopulateHooks(productSchema, populate);
applyVirtualReferenceIdHooks(
  productSchema,
  'restaurantObjectId',
  'restaurantId',
);
applyVirtualIdHooks(productSchema);
export const ProductModel = model<IProductDocument>('Product', productSchema);
