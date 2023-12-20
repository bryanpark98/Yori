import { CreateMenuRequest, UpdateMenuRequest } from '@yori/types/api/menu';
import { Request, Response } from 'express';
import { RequestValidator } from './utils/request_validator';
import { authenticate } from '../middleware/authentication';
import PromiseRouter from 'express-promise-router';
import { ApiError } from '../common/api_error';
import { MenuController } from '../controllers/menu';

export const router = PromiseRouter();

router.post('/', authenticate, async (req: Request, res: Response) => {
  const request = RequestValidator.validate<CreateMenuRequest>(
    req.body.request,
  );
  const { adminRestaurantId } = req;
  if (adminRestaurantId !== request.restaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  res.json(await MenuController.create(request)).end();
});

router.put('/:menuId', authenticate, async (req, res) => {
  const request = RequestValidator.validate<UpdateMenuRequest>(
    req.body.request,
  );
  const { adminRestaurantId } = req;
  if (adminRestaurantId !== request.restaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  res.json(await MenuController.update(request)).end();
});

export default router;
