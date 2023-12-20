import { CreateOrderRequest } from '@yori/types/src/api/order';

import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import { OrderController } from '../controllers/OrderController';
import {
  authenticate,
  authenticateRestaurantAdmin,
} from '../middleware/authentication';
import { RequestValidator } from './utils/request_validator';
import { RestaurantController } from '../controllers/RestaurantController';

export const router = PromiseRouter();

router.post(
  '/restaurants/:restaurantId/tables/:tableId/party/:partyId/orders',
  authenticate,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error('User not found');
    const { partyId } = req.params;
    const request = RequestValidator.validate<CreateOrderRequest>(
      req.body.request,
    );
    res.json(await OrderController.createOrder(userId, partyId, request)).end();
  },
);

router.post(
  '/restaurants/:restaurantId/tables/:tableId/party/:partyId/orders/:orderId/cancel',
  authenticate,
  async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new Error('User not found');
    res
      .json(await OrderController.requestOrderCancellation(orderId, userId))
      .end();
  },
);

router.post(
  '/restaurants/:restaurantId/tables/:tableId/party/:partyId/orders/:orderId/status',
  authenticateRestaurantAdmin,
  async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    res.json(await OrderController.changeOrderStatus(orderId, status)).end();
  },
);

export default router;
