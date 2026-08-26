import request from 'supertest';
import { app } from '../index.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import Ebook from '../models/Ebook.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('eBook Endpoints & Ownership IDOR Protection', () => {
  let userAToken;
  let userBToken;
  let userAId;
  let userBId;

  beforeEach(async () => {
    // Create User A
    const resA = await request(app).post('/api/users').send({
      name: 'User A',
      email: 'userA@example.com',
      password: 'Password123!',
    });
    userAToken = resA.body.token;
    userAId = resA.body._id;

    // Create User B
    const resB = await request(app).post('/api/users').send({
      name: 'User B',
      email: 'userB@example.com',
      password: 'Password123!',
    });
    userBToken = resB.body.token;
    userBId = resB.body._id;
  });

  describe('POST /api/ebooks', () => {
    it('should create an ebook with status generating for authenticated user', async () => {
      const res = await request(app)
        .post('/api/ebooks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'AI in 2026',
          description: 'A comprehensive book on generative intelligence',
          coverColor: 'bg-indigo-600',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('AI in 2026');
      expect(res.body.status).toBe('generating');
      expect(res.body.user).toBe(userAId);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/ebooks')
        .send({
          title: 'Unauthorized Book',
          description: 'Should fail',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('IDOR / Ownership Isolation', () => {
    let ebookA;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/ebooks')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'User A Exclusive Novel',
          description: 'Top secret content owned by User A',
        });
      ebookA = createRes.body;
    });

    it('User A should be able to get their own ebook', async () => {
      const res = await request(app)
        .get(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(ebookA._id);
      expect(res.body.title).toBe('User A Exclusive Novel');
    });

    it('User B should NOT be able to read User A ebook (IDOR Prevention -> 404)', async () => {
      const res = await request(app)
        .get(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/ebook not found/i);
    });

    it('User B should NOT be able to update User A ebook (IDOR Prevention -> 404)', async () => {
      const res = await request(app)
        .put(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'Hacked by User B',
        });

      expect(res.status).toBe(404);

      // Verify the ebook was not modified
      const original = await Ebook.findById(ebookA._id);
      expect(original.title).toBe('User A Exclusive Novel');
    });

    it('User B should NOT be able to delete User A ebook (IDOR Prevention -> 404)', async () => {
      const res = await request(app)
        .delete(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);

      // Verify the ebook still exists
      const existing = await Ebook.findById(ebookA._id);
      expect(existing).not.toBeNull();
    });

    it('User A should be able to update and delete their own ebook', async () => {
      const updateRes = await request(app)
        .put(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Updated Title by Owner',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Title by Owner');

      const deleteRes = await request(app)
        .delete(`/api/ebooks/${ebookA._id}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(deleteRes.status).toBe(200);

      const check = await Ebook.findById(ebookA._id);
      expect(check).toBeNull();
    });
  });
});
