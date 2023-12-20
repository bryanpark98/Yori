import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from '@yori/types/src/api/restaurant';
import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import multer from 'multer';
import { RestaurantController } from '../controllers/RestaurantController';
import {
  authenticate,
  authenticateRestaurantAdmin,
} from '../middleware/authentication';
import { RequestValidator } from './utils/request_validator';

const upload = multer();
export const router = PromiseRouter();

router.post(
  '/restaurants',
  authenticateRestaurantAdmin,
  async (req: Request, res: Response) => {
    const request = RequestValidator.validate<CreateRestaurantRequest>(
      req.body.request,
    );
    res.json(await RestaurantController.create(request)).end();
  },
);

router.get('/restaurants/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  res.json(await RestaurantController.readPublic(restaurantId)).end();
});

router.get(
  '/restaurants/:restaurantId/private',
  authenticateRestaurantAdmin,
  async (req, res) => {
    const { restaurantId } = req.params;
    res.json(await RestaurantController.readPrivate(restaurantId)).end();
  },
);

router.put(
  '/restaurants/:restaurantId',
  authenticateRestaurantAdmin,
  upload.single('image'),
  async (req, res) => {
    const request = RequestValidator.validate<UpdateRestaurantRequest>(
      JSON.parse(req.body.request), // TODO: multipart data must be manually parsed like this, fix this with some middleware
    );
    res.json(await RestaurantController.update(request, req.file)).end();
  },
);

router.get(
  '/restaurants/:restaurantId/products',
  authenticate,
  async (req, res) => {
    const restaurantId = req.params.restaurantId;
    res.json(await RestaurantController.readProducts(restaurantId)).end();
  },
);

export default router;
