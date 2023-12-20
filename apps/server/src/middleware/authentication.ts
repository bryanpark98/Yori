import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../common/api_error';
import { JwtPayload, verify } from 'jsonwebtoken';
import config from '../utils/config';
import { UserModel } from '../models/UserModel';
import { Types } from 'mongoose';
import { TokenPayload } from '../utils/types';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) throw new ApiError('No token provided', 401);
  let payload: JwtPayload;
  try {
    payload = (await verify(token, config.jwtSecret)) as TokenPayload;
  } catch (err) {
    throw new ApiError(`Invalid token ${token}`, 401);
  }
  // TODO: enforce some JWT structure
  if (payload.data.userId) {
    const user = await UserModel.findById(
      new Types.ObjectId(payload.data.userId),
    );
    if (user == null) {
      throw new ApiError('Invalid token, user does not exist', 401);
    }
    req.user = user;
  }
  next();
}

/**
 * Authenticates route for restaurant admin, can only be used on routes with :restaurantId
 * TODO: enforce this through types somehow
 */
export async function authenticateRestaurantAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) throw new ApiError('No token provided', 401);
  let payload: JwtPayload;
  try {
    payload = (await verify(token, config.jwtSecret)) as TokenPayload;
  } catch (err) {
    throw new ApiError(`Invalid token ${token}`, 401);
  }
  // TODO: enforce some JWT structure
  if (payload.data.userId) {
    const user = await UserModel.findById(
      new Types.ObjectId(payload.data.userId),
    );
    if (user == null) {
      throw new ApiError('Invalid token, user does not exist', 401);
    }
    req.user = user;
  }
  req.adminRestaurantId = payload.data.adminRestaurantId;
  if (req.params.restaurantId !== req.adminRestaurantId) {
    throw new ApiError('Unauthorized', 401);
  }
  next();
}
