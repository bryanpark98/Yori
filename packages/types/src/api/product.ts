import {
  IProduct,
  IProductOption,
  IProductOptionGroup,
  ProductOptionGroupType,
} from "../core/product";

export type CreateProductRequest = {
  name: string;
  dollarPrice: number;
  restaurantId: string;
  description?: string;
  imageUrl?: string;
  options: CreateProductOptionGroupRequest[];
};

export type CreateProductResponse = {
  product: IProduct;
};

export type UpdateProductRequest = {
  id: string;
  name?: string;
  dollarPrice?: number;
  restaurantId?: string;
  description?: string;
  imageUrl?: string;
  options?: (
    | CreateProductOptionGroupRequest
    | UpdateProductOptionGroupRequest
  )[];
};

export type UpdateProductResponse = {
  product: IProduct;
};

export type CreateProductOptionGroupRequest = {
  name: string;
  options: CreateProductOptionRequest[];
  required: boolean;
  type: ProductOptionGroupType;
};

export type CreateProductOptionGroupResponse = {
  productOptionGroup: IProductOptionGroup;
};

export type UpdateProductOptionGroupRequest = {
  id: string;
  name?: string;
  options?: (CreateProductOptionRequest | UpdateProductOptionRequest)[];
  required?: boolean;
  type?: ProductOptionGroupType;
};

export type UpdateProductOptionGroupResponse = {
  productOptionGroup: IProductOptionGroup;
};

export type CreateProductOptionRequest = {
  name: string;
  dollarPrice: number;
};

export type CreateProductOptionResponse = {
  productOption: IProductOption;
};

export type UpdateProductOptionRequest = {
  id: string;
  name?: string;
  dollarPrice?: number;
};

export type UpdateProductOptionResponse = {
  productOption: IProductOption;
};
