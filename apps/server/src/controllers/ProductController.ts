import {
  CreateProductOptionGroupRequest,
  CreateProductOptionGroupResponse,
  CreateProductOptionRequest,
  CreateProductOptionResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductOptionGroupRequest,
  UpdateProductOptionGroupResponse,
  UpdateProductOptionRequest,
  UpdateProductOptionResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from '@yori/types/src/api/product';
import { ProductService } from '../services/ProductService';
import { routeCreateOrUpdateRequest } from './utils/request_typing';
import { ImageStorageManager } from '../utils/ImageStorageManager';

export class ProductController {
  public static async createProduct(
    request: CreateProductRequest,
    image?: Express.Multer.File,
  ): Promise<CreateProductResponse> {
    const imageUrl = image
      ? await ImageStorageManager.upload(image, 'products')
      : request.imageUrl;
    const { name, dollarPrice, restaurantId, options, description } = request;

    const optionSectionIds = [];
    for (const optionGroupRequest of options) {
      const newProductOptionGroup =
        await ProductController.createProductOptionGroup(optionGroupRequest);
      optionSectionIds.push(newProductOptionGroup.productOptionGroup.id);
    }
    const newProduct = await ProductService.createProduct({
      name,
      dollarPrice,
      restaurantId,
      optionSectionIds,
      imageUrl,
      description,
    });

    return { product: newProduct };
  }

  public static async updateProduct(
    request: UpdateProductRequest,
    image?: Express.Multer.File,
  ): Promise<UpdateProductResponse> {
    if (image != null) {
      request.imageUrl = await ImageStorageManager.upload(image, 'products');
    }

    const {
      id,
      name,
      dollarPrice,
      restaurantId,
      options,
      imageUrl,
      description,
    } = request;
    const optionSectionIds = [];
    for (const optionGroup of options || []) {
      const optionIds = [];
      for (const option of optionGroup.options || []) {
        const newProductOption = await routeCreateOrUpdateRequest(
          option,
          ProductController.createProductOption,
          ProductController.updateProductOption,
        );
        optionIds.push(newProductOption.productOption.dollarPrice);
      }
      const newProductOptionGroup = await routeCreateOrUpdateRequest(
        optionGroup,
        ProductController.createProductOptionGroup,
        ProductController.updateProductOptionGroup,
      );
      optionSectionIds.push(newProductOptionGroup.productOptionGroup.id);
    }
    const updatedProduct = await ProductService.updateProduct({
      id,
      name,
      dollarPrice,
      restaurantId,
      optionSectionIds,
      imageUrl,
      description,
    });

    return { product: updatedProduct };
  }

  private static async createProductOptionGroup(
    request: CreateProductOptionGroupRequest,
  ): Promise<CreateProductOptionGroupResponse> {
    const { name, required, options, type } = request;
    const optionIds = [];
    for (const option of options) {
      const newProductOption = await ProductService.createProductOption({
        name: option.name,
        dollarPrice: option.dollarPrice,
      });
      optionIds.push(newProductOption.id);
    }

    const productOptionGroup = await ProductService.createProductOptionGroup({
      name,
      required,
      optionIds,
      type,
    });
    return { productOptionGroup };
  }

  private static async updateProductOptionGroup(
    request: UpdateProductOptionGroupRequest,
  ): Promise<UpdateProductOptionGroupResponse> {
    const { id, name, required, options, type } = request;
    const optionIds = [];
    for (const option of options || []) {
      const newProductOption = await routeCreateOrUpdateRequest(
        option,
        ProductController.createProductOption,
        ProductController.updateProductOption,
      );
      optionIds.push(newProductOption.productOption.id);
    }

    const productOptionGroup = await ProductService.updateProductOptionGroup({
      id,
      name,
      required,
      optionIds,
      type,
    });
    return { productOptionGroup };
  }

  private static async createProductOption(
    request: CreateProductOptionRequest,
  ): Promise<CreateProductOptionResponse> {
    const { name, dollarPrice } = request;
    const productOption = await ProductService.createProductOption({
      name,
      dollarPrice,
    });
    return { productOption };
  }

  private static async updateProductOption(
    request: UpdateProductOptionRequest,
  ): Promise<UpdateProductOptionResponse> {
    const { id, name, dollarPrice } = request;
    const productOption = await ProductService.updateProductOption({
      id,
      name,
      dollarPrice,
    });
    return { productOption };
  }
}
