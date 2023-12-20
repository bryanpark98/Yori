import { CreateMenuRequest, UpdateMenuRequest } from '@yori/types/src/api/menu';
import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import { MenuController } from '../controllers/MenuController';
import { authenticateRestaurantAdmin } from '../middleware/authentication';
import { RequestValidator } from './utils/request_validator';

export const router = PromiseRouter();

router.post(
  '/restaurants/:restaurantId/menus',
  authenticateRestaurantAdmin,
  async (req: Request, res: Response) => {
    const request = RequestValidator.validate<CreateMenuRequest>(
      req.body.request,
    );
    res.json(await MenuController.createMenu(request)).end();
  },
);

router.put(
  '/restaurants/:restaurantId/menus/:menuId',
  authenticateRestaurantAdmin,
  async (req, res) => {
    const request = RequestValidator.validate<UpdateMenuRequest>(
      req.body.request,
    );
    res.json(await MenuController.updateMenu(request)).end();
  },
);

export default router;
