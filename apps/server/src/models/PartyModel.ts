import { Document, Query, Schema, model } from 'mongoose';
import applyVirtualIdHooks, { applyPopulateHooks } from './utils/schema_hooks';
import { IParty } from '@yori/types/src/core/party';

export interface IPartyDocument extends IParty, Document {
  id: string;
}
export const partySchema = new Schema<IPartyDocument>(
  {
    users: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        default: [],
      },
    ],
    table: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    closedAt: { type: Date, required: false },
  },
  { timestamps: true },
);
// TODO: this is way too much population fix this
const populate = (query: Query<IPartyDocument, IPartyDocument>) => {
  query
    .populate({
      path: 'users',
    })
    .populate({
      path: 'table',
    })
    .populate({
      path: 'orders',
    })
    .populate({
      path: 'orders',
      populate: {
        path: 'items',
        populate: {
          path: 'options',
          populate: {
            path: 'option',
          },
        },
      },
    });
};
applyVirtualIdHooks(partySchema);
applyPopulateHooks(partySchema, populate);
export const PartyModel = model<IPartyDocument>('party', partySchema);
