import {
  CreateTableRequest,
  CreateTableResponse,
  UpdateTableRequest,
  UpdateTableResponse,
} from '@yori/types/src/api/table';
import { TableService } from '../services/TableService';

export class TableController {
  public static async createTable(
    request: CreateTableRequest,
  ): Promise<CreateTableResponse> {
    return {
      table: await TableService.createTable(request.name, request.restaurantId),
    };
  }

  public static async updateTable(
    request: UpdateTableRequest,
  ): Promise<UpdateTableResponse> {
    return { table: await TableService.updateTable(request.id, request.name) };
  }
}
