import PromiseRouter from 'express-promise-router';

const router = PromiseRouter();

// router.post('/', async (req, res) => {
//   const request = RequestValidator.validate<SignupRequest>(req.body.request);
//   return res.json(await UserController.signup(request)).end();
// });

export default router;
