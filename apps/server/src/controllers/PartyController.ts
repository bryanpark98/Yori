import { PartyService } from '../services/PartyService';
import {
  JoinOrCreatePartyRequest,
  JoinOrCreatePartyResponse,
  ReadPartyResponse,
} from '@yori/types/src/api/party';
import { RestaurantService } from '../services/RestaurantService';
import { TableService } from '../services/TableService';

export class PartyController {
  public static async joinOrCreateParty(
    userId: string,
    request: JoinOrCreatePartyRequest,
  ): Promise<JoinOrCreatePartyResponse> {
    const table = await TableService.getTableById(request.tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    const restaurant = await RestaurantService.getRestaurantById(
      table.restaurantId,
    );

    const party = await PartyService.joinOrCreateParty(userId, request.tableId);

    return { party, restaurant };
  }

  public static async readPartyById(
    partyId: string,
  ): Promise<ReadPartyResponse> {
    const party = await PartyService.readPartyById(partyId);
    return { party };
  }
}
