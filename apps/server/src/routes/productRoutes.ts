import {
  CreateProductRequest,
  UpdateProductRequest,
} from '@yori/types/src/api/product';
import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import multer from 'multer';
import { ProductController } from '../controllers/ProductController';
import { authenticateRestaurantAdmin } from '../middleware/authentication';
import { RequestValidator } from './utils/request_validator';

const upload = multer();
export const router = PromiseRouter();

router.post(
  '/restaurants/:restaurantId/products',
  authenticateRestaurantAdmin,
  upload.single('image'),
  async (req: Request, res: Response) => {
    const request = RequestValidator.validate<CreateProductRequest>(
      JSON.parse(req.body.request),
    );
    res.json(await ProductController.createProduct(request, req.file)).end();
  },
);

router.put(
  '/restaurants/:restaurantId/products/:productId',
  authenticateRestaurantAdmin,
  upload.single('image'),
  async (req, res) => {
    const request = RequestValidator.validate<UpdateProductRequest>(
      JSON.parse(req.body.request),
    );
    res.json(await ProductController.updateProduct(request, req.file)).end();
  },
);

export default router;
