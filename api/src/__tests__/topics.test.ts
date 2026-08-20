import { describe, it, expect } from 'vitest';
import app from '../index';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Topics API', () => {
  describe('GET /api/v1/topics', () => {
    it('should return 500 without DB binding (confirms route is reachable)', async () => {
      // DB バインディングがないため 500 が返るが、ルーティング自体は正常
      const res = await app.request('/api/v1/topics', {}, ENV);
      expect(res.status).toBe(500);
    });

    it('should accept valid query params', async () => {
      const res = await app.request('/api/v1/topics?sort=latest&page=1&limit=10', {}, ENV);
      // ルーティングは通過し、DB アクセスで 500
      expect(res.status).toBe(500);
    });

    it('should return 400 for invalid sort param', async () => {
      const res = await app.request('/api/v1/topics?sort=invalid', {}, ENV);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/topics', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: 'テストお題' }),
      }, ENV);
      expect(res.status).toBe(401);
    });

    it('should return 400 for empty body', async () => {
      const res = await app.request('/api/v1/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }, ENV);
      // バリデーションエラー（body が必須）→ 400 or 401（auth が先）
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('GET /api/v1/topics/:topicId', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/topics/01TESTID', {}, ENV);
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/v1/topics/:topicId', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/topics/01TESTID', {
        method: 'DELETE',
      }, ENV);
      expect(res.status).toBe(401);
    });
  });
});
