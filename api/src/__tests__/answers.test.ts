import { describe, it, expect } from 'vitest';
import app from '../index';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Answers API', () => {
  describe('GET /api/v1/topics/:topicId/answers', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/topics/01TESTID/answers', {}, ENV);
      expect(res.status).toBe(500);
    });

    it('should return 400 for invalid sort param', async () => {
      const res = await app.request('/api/v1/topics/01TESTID/answers?sort=invalid', {}, ENV);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/topics/:topicId/answers', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/topics/01TESTID/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: 'テスト回答' }),
      }, ENV);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/answers/:answerId', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/answers/01TESTID', {}, ENV);
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/v1/answers/:answerId', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/answers/01TESTID', {
        method: 'DELETE',
      }, ENV);
      expect(res.status).toBe(401);
    });
  });
});
