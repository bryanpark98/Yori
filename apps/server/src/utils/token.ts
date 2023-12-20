import { sign } from 'jsonwebtoken';
import { TokenData, TokenPayload } from './types';
import config from './config';

export const generateToken = (data: TokenData): string => {
  const tokenPayload: TokenPayload = { time: Date(), data };
  return sign(tokenPayload, config.jwtSecret);
};
