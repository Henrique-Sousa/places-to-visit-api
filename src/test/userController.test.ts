import request from 'supertest';
import express from 'express';
import { connect, connection } from 'mongoose';

import User from '../models/user';
import logUserIn from '../controllers/userController';

async function run(): Promise<void> {
  await connect('mongodb://localhost:27017/tindin-fase2-test');
}

beforeEach(async () => {
  run().catch((err) => console.log(err))
});

afterEach(async () => {
  await connection.close();
});

const app = express();
app.use(express.json());

app.use('/login', logUserIn);

test('POST /login', async () => {
  const newUser = new User({
    name: 'user1',
    email: 'user1@mail.com',
    password: '$2a$10$BCdw6gBo5HfenKQVRnku1OFr2Jncrn4BQT5wtRMfp7xr9kAx69W1G',
  });

  await newUser.save();

  const result = await request(app)
    .get('/login')
    .send({
      email: 'user1@mail.com',
      password: '123456',
    })
    .expect('Content-Type', /json/)
    .expect(200);
  expect(result.body).toHaveProperty('token');
  expect(result.body).toHaveProperty('user');
  expect(result.body.user.name).toBe('user1');

  await User.deleteOne({ name: 'user1' });
});
