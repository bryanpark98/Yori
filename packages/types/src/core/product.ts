export interface IProduct {
  id: string;
  name: string;
  dollarPrice: number;
  restaurantId: string;
  description?: string;
  imageUrl?: string;
  options: IProductOptionGroup[];
}

export interface IProductOptionGroup {
  id: string;
  name: string;
  options: IProductOption[];
  required: boolean;
  type: ProductOptionGroupType;
}

export enum ProductOptionGroupType {
  Single = "SINGLE", // Can only select one option
  Multiple = "MULTIPLE", // Can select multiple options
  Add = "ADD", // Can add multiple of each option
}

export interface IProductOption {
  id: string;
  name: string;
  dollarPrice: number;
}
