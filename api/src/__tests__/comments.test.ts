import { describe, it, expect } from 'vitest';
import app from '../index';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Comments API', () => {
  describe('GET /api/v1/answers/:answerId/comments', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/comments', {}, ENV);
      expect(res.status).toBe(500);
    });

    it('should accept valid pagination params', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/comments?page=1&limit=10', {}, ENV);
      expect(res.status).toBe(500); // ルーティングは通過、DB なしで 500
    });
  });

  describe('POST /api/v1/answers/:answerId/comments', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: 'テストコメント' }),
      }, ENV);
      expect(res.status).toBe(401);
    });

    it('should return 400 or 401 for empty body', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }, ENV);
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('DELETE /api/v1/answers/:answerId/comments/:commentId', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/comments/01COMMENTID', {
        method: 'DELETE',
      }, ENV);
      expect(res.status).toBe(401);
    });
  });
});
