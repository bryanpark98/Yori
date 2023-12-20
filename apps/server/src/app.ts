import cors from 'cors';
import express, { Request, Response } from 'express';
import { errorHandler } from './middleware/error_handler';
import authenticationRouter from './routes/authenticationRoutes';
import menuRouter from './routes/menuRoutes';
import partyRouter from './routes/partyRoutes';
import productRouter from './routes/productRoutes';
import restaurantRouter from './routes/restaurantRoutes';
import orderRouter from './routes/orderRoutes';
import userRouter from './routes/userRoutes';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

// Register routers
app.use('/api', userRouter);
app.use('/api', restaurantRouter);
app.use('/api', menuRouter);
app.use('/api', productRouter);
app.use('/api', partyRouter);
app.use('/api', orderRouter);
app.use('/api/authentication', authenticationRouter);

app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Not found' });
  logger.error(`Not found ${_req.originalUrl}`);
});

app.use((err: Error, _req: Request, res: Response) => {
  logger.error(err.message, err);
  res.status(500).send('Something went wrong.');
});

export default app;
