import { TestDatabase } from './utils/test_database';
import request from 'supertest';
import app from '../../src/app';
import { LoginRequest, SignupRequest } from '@yori/types/src/api/user';

let testDatabase: TestDatabase;

beforeAll(async () => {
  testDatabase = await TestDatabase.create();
  await testDatabase.connect();
});
afterEach(async () => await testDatabase.clearDatabase());
afterAll(async () => await testDatabase.closeDatabase());

test('should return 200 when login with valid credentials', async () => {
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

  const loginRequest: LoginRequest = {
    email: 'test@test.com',
    password: 'test',
  };
  const loginRes = await request(app)
    .post('/api/user/login')
    .send(loginRequest);
  expect(loginRes.status).toBe(200);
  expect(loginRes.body).toHaveProperty('token');
});

test('should return 200 when create default account', async () => {
  const signupRes = await request(app).post('/api/user/signup/default');
  expect(signupRes.status).toBe(200);
  expect(signupRes.body).toHaveProperty('token');
});

test('should return 404 when login with invalid credentials', async () => {
  const loginRequest: LoginRequest = {
    email: '',
    password: 'test',
  };
  const loginRes = await request(app)
    .post('/api/user/login')
    .send(loginRequest);
  expect(loginRes.status).toBe(404);
});

test('should return 401 when login with invalid credentials', async () => {
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

  const loginRequest: LoginRequest = {
    email: 'test@test.com',
    password: 'test2',
  };
  const loginRes = await request(app)
    .post('/api/user/login')
    .send(loginRequest);
  expect(loginRes.status).toBe(401);
});
