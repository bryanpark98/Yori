import { ITable } from '@yori/types/src/core/table';
import { TableModel } from '../models/TableModel';
import { Types } from 'mongoose';

export class TableService {
  public static async createTable(
    name: string,
    restaurantId: string,
  ): Promise<ITable> {
    const table = await TableModel.create({ name, restaurantId });
    return table.toObject();
  }

  public static async updateTable(id: string, name: string): Promise<ITable> {
    const table = await TableModel.findById(new Types.ObjectId(id));
    if (!table) throw new Error('Table not found');

    table.name = name;
    await table.save();
    return table.toObject();
  }

  public static async getTableById(id: string): Promise<ITable | null> {
    const table = await TableModel.findById(new Types.ObjectId(id));
    return table?.toObject() ?? null;
  }
}
