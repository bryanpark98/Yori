import { ITable } from "../core/table";

export type CreateTableRequest = {
  name: string;
  restaurantId: string;
};

export type CreateTableResponse = {
  table: ITable;
};

export type UpdateTableRequest = {
  id: string;
  name: string;
};

export type UpdateTableResponse = {
  table: ITable;
};
