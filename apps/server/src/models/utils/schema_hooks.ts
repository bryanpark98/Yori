import { Document, Query, Schema, Types } from 'mongoose';
import { IRestaurantDocument } from '../RestaurantModel';

export default function applyVirtualIdHooks(schema: Schema) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema.virtual('id').get(function (this: any) {
    return this._id.toHexString();
  });

  schema.set('toObject', { virtuals: true });

  schema.set('toJSON', { virtuals: true });
}

export function applyPopulateHooks(
  schema: Schema,
  populateFn?: (query: Query<any, any>) => void,
) {
  schema.pre('find', function () {
    populateFn && populateFn(this);
  });
  schema.pre('findOne', function () {
    populateFn && populateFn(this);
  });
}

export function applyVirtualReferenceIdHooks(
  schema: Schema,
  objectIdKey: string,
  idKey: string,
) {
  schema
    .virtual(idKey)
    .get(function (this: any) {
      if (!this[objectIdKey]) return null;
      return this[objectIdKey].toHexString();
    })
    .set(function (this: any, value: string) {
      this[objectIdKey] = new Types.ObjectId(value);
    });
  const setObjectId = async function (this: any, next: any) {
    try {
      this[objectIdKey] = new Types.ObjectId(this[idKey]);
    } catch (error: unknown) {
      next(error as Error);
    }
    next();
  };
  schema.pre('save', setObjectId);
}
