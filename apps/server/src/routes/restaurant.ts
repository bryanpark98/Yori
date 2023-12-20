import {
  CreateRestaurantRequest,
  ReadRestaurantPrivateRequest,
  ReadRestaurantProductsRequest,
  UpdateRestaurantRequest,
} from '@yori/types/api/restaurant';
import { Request, Response } from 'express';
import { RequestValidator } from './utils/request_validator';
import { RestaurantController } from '../controllers/restaurant';
import { authenticate } from '../middleware/authentication';
import PromiseRouter from 'express-promise-router';
import { ApiError } from '../common/api_error';

export const router = PromiseRouter();

router.post('/', authenticate, async (req: Request, res: Response) => {
  const request = RequestValidator.validate<CreateRestaurantRequest>(
    req.body.request,
  );
  res.json(await RestaurantController.create(request)).end();
});

router.get('/private/:restaurantId', authenticate, async (req, res) => {
  const { adminRestaurantId } = req;
  const restaurantId = req.params.restaurantId;
  if (adminRestaurantId !== restaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  const request: ReadRestaurantPrivateRequest = {
    restaurantId,
  };
  res.json(await RestaurantController.readPrivate(request)).end();
});

router.put('/:restaurantId', authenticate, async (req, res) => {
  const { adminRestaurantId } = req;
  const restaurantId = req.params.restaurantId;
  if (adminRestaurantId !== restaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  const request = RequestValidator.validate<UpdateRestaurantRequest>(
    req.body.request,
  );
  res.json(await RestaurantController.update(request)).end();
});

router.get('/products/:restaurantId', authenticate, async (req, res) => {
  const { adminRestaurantId } = req;
  const restaurantId = req.params.restaurantId;
  if (adminRestaurantId !== restaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  const request: ReadRestaurantProductsRequest = {
    restaurantId,
  };
  res.json(await RestaurantController.readProducts(request)).end();
});

export default router;
