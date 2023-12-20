import { IMenu, IMenuSection } from '@yori/types/src/core/menu';
import { Document, Schema, Types, model } from 'mongoose';
import applyVirtualIdHooks, {
  applyVirtualReferenceIdHooks,
} from './utils/schema_hooks';

export interface IMenuSectionDocument extends IMenuSection, Document {
  id: string;
}
export const menuSectionSchema = new Schema<IMenuSectionDocument>(
  {
    name: { type: String, required: true },
    menuItems: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
applyVirtualIdHooks(menuSectionSchema);
export const MenuSectionModel = model<IMenuSectionDocument>(
  'MenuSection',
  menuSectionSchema,
);

export interface IMenuDocument extends IMenu, Document {
  id: string;
  restaurantObjectId: Types.ObjectId;
}
export const menuSchema = new Schema<IMenuDocument>(
  {
    name: { type: String, required: true },
    hours: {
      type: {
        opensAtMinutes: Number,
        closesAtMinutes: Number,
      },
      required: false,
    },
    menuSections: {
      type: [{ type: Schema.Types.ObjectId, ref: 'MenuSection' }],
      default: [],
    },
    published: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    restaurantObjectId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  },
  { timestamps: true },
);
applyVirtualReferenceIdHooks(menuSchema, 'restaurantObjectId', 'restaurantId');
applyVirtualIdHooks(menuSchema);
export const MenuModel = model<IMenuDocument>('Menu', menuSchema);
