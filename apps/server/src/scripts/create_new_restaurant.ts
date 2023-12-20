import { connect } from 'mongoose';
import config from '../utils/config';
import minimist from 'minimist';
import { RestaurantModel } from '../models/RestaurantModel';
import { randomUUID } from 'crypto';
import { exit } from 'process';

const main = async () => {
  await connect(config.mongoUrl);
  const argv = minimist(process.argv.slice(2));
  const restaurantName = argv['name'];
  if (!restaurantName) throw new Error('No restaurant name provided');
  const adminToken = randomUUID();
  // eslint-disable-next-line no-console
  console.log(
    `Creating restaurant ${restaurantName} with admin token ${adminToken}`,
  );
  await RestaurantModel.create({
    name: restaurantName,
    adminToken: adminToken,
  });
  // eslint-disable-next-line no-console
  console.log('Done');
  exit(0);
};

main();
