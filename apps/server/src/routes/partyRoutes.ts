import { JoinOrCreatePartyRequest } from '@yori/types/src/api/party';
import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import { ApiError } from '../common/api_error';
import { PartyController } from '../controllers/PartyController';
import {
  authenticate,
  authenticateRestaurantAdmin,
} from '../middleware/authentication';
import { RequestValidator } from './utils/request_validator';
import { RestaurantController } from '../controllers/RestaurantController';

export const router = PromiseRouter();

router.post(
  '/restaurants/:restaurantId/tables/:tableId/party',
  authenticate,
  async (req: Request, res: Response) => {
    const request = RequestValidator.validate<JoinOrCreatePartyRequest>(
      req.body.request,
    );
    const { user } = req;
    if (!user) throw new ApiError('User not found', 401);
    res.json(await PartyController.joinOrCreateParty(user.id, request)).end();
  },
);

router.get(
  '/restaurants/:restaurantId/tables/:tableId/party/:partyId',
  async (req, res) => {
    const { partyId } = req.params;
    res.json(await PartyController.readPartyById(partyId)).end();
  },
);

router.get(
  '/restaurants/:restaurantId/parties',
  authenticateRestaurantAdmin,
  async (req, res) => {
    const { restaurantId } = req.params;
    res.json(await RestaurantController.readActiveParties(restaurantId)).end();
  },
);

export default router;
