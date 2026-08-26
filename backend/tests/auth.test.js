import request from 'supertest';
import { app } from '../index.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Authentication & Profile Endpoints', () => {
  const validUser = {
    name: 'Alice Writer',
    email: 'alice@example.com',
    password: 'Password123!',
  };

  describe('POST /api/users (Registration)', () => {
    it('should successfully register a new user and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe(validUser.name);
      expect(res.body.email).toBe(validUser.email);
    });

    it('should reject registration when email is already registered', async () => {
      await request(app).post('/api/users').send(validUser);

      const res = await request(app)
        .post('/api/users')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration with a weak password', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Alice',
          email: 'alice2@example.com',
          password: 'weak',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/users').send(validUser);
    });

    it('should log in with valid credentials and return a token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: validUser.email,
          password: validUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(validUser.email);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: validUser.email,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nobody@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });

  describe('GET & PUT /api/users/profile', () => {
    let token;

    beforeEach(async () => {
      const regRes = await request(app).post('/api/users').send(validUser);
      token = regRes.body.token;
    });

    it('should reject access to profile without token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });

    it('should fetch user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(validUser.email);
      expect(res.body.name).toBe(validUser.name);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should update user profile details when authenticated', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Alice Updated',
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Alice Updated');
      expect(res.body).toHaveProperty('token');
    });
  });
});
