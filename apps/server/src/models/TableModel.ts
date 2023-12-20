import { ITable } from '@yori/types/src/core/table';
import { Document, Schema, Types, model } from 'mongoose';
import applyVirtualIdHooks, {
  applyVirtualReferenceIdHooks,
} from './utils/schema_hooks';

export interface ITableDocument extends ITable, Document {
  id: string;
  restaurantObjectId: Types.ObjectId;
}
export const tableSchema = new Schema<ITableDocument>(
  {
    name: { type: String, required: true },
    restaurantObjectId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  },
  { timestamps: true },
);
applyVirtualIdHooks(tableSchema);
applyVirtualReferenceIdHooks(tableSchema, 'restaurantObjectId', 'restaurantId');
export const TableModel = model<ITableDocument>('Table', tableSchema);
