import { createServer } from 'http';
import { connect } from 'mongoose';
import app from './app';
import { IUserDocument } from './models/UserModel';
import { initSocketIo } from './socket/socketManager';
import config from './utils/config';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserDocument;
      adminRestaurantId?: string; // id of the restaurant associated with token used for login
    }
  }
}

async function main() {
  await connect(
    'mongodb+srv://server:IUefA0xUdn2lVZd4@yori.1ufdlsk.mongodb.net/?retryWrites=true&w=majority',
  );

  const httpServer = createServer(app);

  initSocketIo(httpServer);

  httpServer.listen(config.port, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${config.port}`,
    );
  });
}

main();
