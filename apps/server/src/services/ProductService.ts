import {
  IProduct,
  IProductOption,
  IProductOptionGroup,
  ProductOptionGroupType,
} from '@yori/types/src/core/product';
import {
  ProductModel,
  ProductOptionModel,
  ProductOptionGroupModel,
} from '../models/ProductModel';
import { Types } from 'mongoose';
import { ApiError } from '../common/api_error';

export class ProductService {
  public static async createProduct(productData: {
    name: string;
    dollarPrice: number;
    restaurantId: string;
    description?: string;
    imageUrl?: string;
    optionSectionIds: string[];
  }) {
    const {
      name,
      dollarPrice,
      restaurantId,
      description,
      imageUrl,
      optionSectionIds,
    } = productData;

    const newProduct = new ProductModel();
    newProduct.name = name;
    newProduct.dollarPrice = dollarPrice;
    newProduct.restaurantId = restaurantId;
    newProduct.description = description;
    newProduct.imageUrl = imageUrl;
    newProduct.set({ options: optionSectionIds });

    await newProduct.save();
    return newProduct.toObject();
  }

  public static async updateProduct(productData: {
    id: string;
    name?: string;
    dollarPrice?: number;
    restaurantId?: string;
    description?: string;
    imageUrl?: string;
    optionSectionIds?: string[];
  }): Promise<IProduct> {
    const {
      id,
      name,
      dollarPrice,
      restaurantId,
      description,
      imageUrl,
      optionSectionIds,
    } = productData;
    const product = await ProductModel.findById(new Types.ObjectId(id));
    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    product.id = id;
    product.name = name || product.name;
    product.dollarPrice = dollarPrice || product.dollarPrice;
    product.restaurantId = restaurantId || product.restaurantId;
    product.description = description;
    product.imageUrl = imageUrl;
    product.set({ options: optionSectionIds || product.options });

    await product.save();
    return product.toObject();
  }

  public static async createProductOptionGroup(productOptionData: {
    name: string;
    optionIds: string[];
    required: boolean;
    type: ProductOptionGroupType;
  }): Promise<IProductOptionGroup> {
    const { name, optionIds, required, type } = productOptionData;

    const newProductOptionGroup = new ProductOptionGroupModel();
    newProductOptionGroup.name = name;
    newProductOptionGroup.required = required;
    newProductOptionGroup.type = type;
    newProductOptionGroup.set({ options: optionIds });

    await newProductOptionGroup.save();
    return newProductOptionGroup.toObject();
  }

  public static async updateProductOptionGroup(productOptionData: {
    id: string;
    name?: string;
    optionIds?: string[];
    required?: boolean;
    type?: ProductOptionGroupType;
  }): Promise<IProductOptionGroup> {
    const { id, name, optionIds, required, type } = productOptionData;
    const productOptionGroup = await ProductOptionGroupModel.findById(
      new Types.ObjectId(id),
    );
    if (!productOptionGroup) {
      throw new ApiError('Product option group not found', 404);
    }

    productOptionGroup.name = name || productOptionGroup.name;
    productOptionGroup.required = required || productOptionGroup.required;
    productOptionGroup.type = type || productOptionGroup.type;
    productOptionGroup.set({
      options: optionIds || productOptionGroup.options,
    });

    await productOptionGroup.save();
    return productOptionGroup.toObject();
  }

  public static async createProductOption(productOptionData: {
    name: string;
    dollarPrice: number;
  }): Promise<IProductOption> {
    const { name, dollarPrice } = productOptionData;

    const newProductOption = new ProductOptionModel();
    newProductOption.name = name;
    newProductOption.dollarPrice = dollarPrice;

    await newProductOption.save();
    return newProductOption.toObject();
  }

  public static async updateProductOption(productOptionData: {
    id: string;
    name?: string;
    dollarPrice?: number;
  }) {
    const { id, name, dollarPrice } = productOptionData;
    const productOption = await ProductOptionModel.findById(
      new Types.ObjectId(id),
    );
    if (!productOption) {
      throw new ApiError('Product option not found', 404);
    }

    productOption.id = id;
    productOption.name = name || productOption.name;
    productOption.dollarPrice = dollarPrice || productOption.dollarPrice;

    await productOption.save();
    return productOption.toObject();
  }
}
