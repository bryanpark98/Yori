import { LoginWithRestaurantTokenRequest } from '@yori/types/src/api/authentication';
import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { RequestValidator } from './utils/request_validator';

export const router = PromiseRouter();

router.post('/login/restaurant-token', async (req: Request, res: Response) => {
  const request = RequestValidator.validate<LoginWithRestaurantTokenRequest>(
    req.body.request,
  );
  res
    .json(await AuthenticationController.loginWithRestaurantToken(request))
    .end();
});

router.post('/login/new-user', async (_req, res) => {
  return res.json(await AuthenticationController.loginNewUser());
});

export default router;
