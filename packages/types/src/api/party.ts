import { IParty } from "../core/party";
import { IRestaurantPublic } from "../core/restaurant";

export type JoinOrCreatePartyRequest = {
  tableId: string;
};

export type JoinOrCreatePartyResponse = {
  party: IParty;
  restaurant: IRestaurantPublic;
};

export type ReadPartyResponse = {
  party: IParty;
};
