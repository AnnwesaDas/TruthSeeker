const express = require('express');
const request = require('supertest');
const authRouter = require('./auth');

describe('Auth route validation smoke test', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  test('POST /api/auth/signup returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'smoke@test.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'All fields are required' });
  });
});