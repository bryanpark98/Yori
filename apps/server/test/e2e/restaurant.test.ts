import { TestDatabase } from './utils/test_database';
import request from 'supertest';
import app from '../../src/app';
import { SignupRequest } from '@yori/types/src/api/user';
import { CreateRestaurantRequest } from '@yori/types/src/api/restaurant';

let testDatabase: TestDatabase;

beforeAll(async () => {
  testDatabase = await TestDatabase.create();
  await testDatabase.connect();
});
afterEach(async () => await testDatabase.clearDatabase());
afterAll(async () => await testDatabase.closeDatabase());

test('create restaurant', async () => {
  const signupRequest: SignupRequest = {
    email: 'test@test.com',
    password: 'test',
    firstName: 'test',
    lastName: 'test',
  };
  const signupRes = await request(app)
    .post('/api/user/signup')
    .send(signupRequest);
  expect(signupRes.status).toBe(200);
  expect(signupRes.body).toHaveProperty('token');
  const token = signupRes.body.token;

  const createRestaurantRequest: CreateRestaurantRequest = {
    name: 'name',
    description: 'description',
  };
  const createRestaurantRes = await request(app)
    .post('/api/restaurant')
    .send(createRestaurantRequest)
    .auth(token, { type: 'bearer' });
  expect(createRestaurantRes.status).toBe(200);
});
