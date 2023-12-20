import { IParty } from '@yori/types/src/core/party';
import { PartyModel } from '../models/PartyModel';
import { TableModel } from '../models/TableModel';
import { Types } from 'mongoose';
import { UserModel } from '../models/UserModel';
import { IOrder } from '@yori/types/src/core/order';
import { OrderModel } from '../models/OrderModel';

export class PartyService {
  public static async joinOrCreateParty(
    userId: string,
    tableId: string,
  ): Promise<IParty> {
    const openParty = await PartyModel.findOne({
      closedAt: null,
    });
    if (openParty) {
      const includesUser = openParty.users.some((u) => u.id === userId);
      if (!includesUser) {
        openParty.set({
          users: [...openParty.users, new Types.ObjectId(userId)],
        });
        await openParty.save();
      }
      return openParty.toObject();
    }
    return await PartyService.createParty(userId, tableId);
  }

  public static async readPartyById(partyId: string): Promise<IParty> {
    const party = await PartyModel.findById(new Types.ObjectId(partyId));
    if (!party) throw new Error('Party not found');
    return party.toObject();
  }

  public static async readPartyByTableId(tableId: string): Promise<IParty> {
    const party = await PartyModel.findOne({
      table: new Types.ObjectId(tableId),
      closedAt: null,
    });
    if (!party) throw new Error('Party not found');
    return party.toObject();
  }

  public static async createParty(
    creatorUserId: string,
    tableId: string,
  ): Promise<IParty> {
    const table = await TableModel.findById(tableId);
    if (!table) throw new Error('Table not found');

    const creator = await UserModel.findById(new Types.ObjectId(creatorUserId));

    return await PartyModel.create({
      users: [creator],
      table,
      restaurantId: table.restaurantId,
    });
  }
}
