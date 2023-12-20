import { Request, Response } from 'express';
import { RequestValidator } from './utils/request_validator';
import { authenticate } from '../middleware/authentication';
import PromiseRouter from 'express-promise-router';
import { ApiError } from '../common/api_error';
import { ProductController } from '../controllers/product';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '@yori/types/api/product';
import { ImageStorageManager } from '../utils/image_storage';
import multer from 'multer';

const upload = multer();
export const router = PromiseRouter();

router.post(
  '/',
  authenticate,
  upload.single('image'),
  async (req: Request, res: Response) => {
    const request = RequestValidator.validate<CreateProductRequest>(
      JSON.parse(req.body.request),
    );
    const { adminRestaurantId } = req;
    if (adminRestaurantId !== request.restaurantId) {
      throw new ApiError('Unauthorized', 401);
    }

    // Try to upload image and put new path in request
    const uploadedFile = req.file;
    if (uploadedFile != null) {
      request.imageUrl = await ImageStorageManager.upload(uploadedFile);
    }

    res.json(await ProductController.create(request)).end();
  },
);

router.put(
  '/:productId',
  authenticate,
  upload.single('image'),
  async (req, res) => {
    const request = RequestValidator.validate<UpdateProductRequest>(
      JSON.parse(req.body.request),
    );
    const { adminRestaurantId } = req;
    if (adminRestaurantId !== request.restaurantId) {
      throw new ApiError('Unauthorized', 401);
    }

    // Try to upload image and put new path in request
    const uploadedFile = req.file;
    if (uploadedFile != null) {
      request.imageUrl = await ImageStorageManager.upload(uploadedFile);
    }

    res.json(await ProductController.update(request)).end();
  },
);

export default router;
