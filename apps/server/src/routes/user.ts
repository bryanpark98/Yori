import PromiseRouter from 'express-promise-router';
import { UserController } from '../controllers/user';
import { RequestValidator } from './utils/request_validator';
import { LoginRequest, SignupRequest } from '@yori/types/api/user';

const router = PromiseRouter();

router.post('/login', async (req, res) => {
  const request = RequestValidator.validate<LoginRequest>(req.body.request);
  return res.json(await UserController.login(request));
});

router.post('/signup', async (req, res) => {
  const request = RequestValidator.validate<SignupRequest>(req.body.request);
  return res.json(await UserController.signup(request)).end();
});

router.post('/signup/default', async (req, res) => {
  return res.json(await UserController.signupDefault()).end();
});

export default router;
