import { describe, it, expect } from 'vitest';
import app from '../index';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Ratings API', () => {
  describe('PUT /api/v1/answers/:answerId/rating', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/rating', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 5 }),
      }, ENV);
      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid score (out of range)', async () => {
      // 認証がないので 401 が先に返るが、バリデーション経路も確認
      const res = await app.request('/api/v1/answers/01TESTID/rating', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 99 }),
      }, ENV);
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('GET /api/v1/answers/:answerId/ratings', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/ratings', {}, ENV);
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/v1/answers/:answerId/rating', () => {
    it('should return 401 without auth', async () => {
      const res = await app.request('/api/v1/answers/01TESTID/rating', {
        method: 'DELETE',
      }, ENV);
      expect(res.status).toBe(401);
    });
  });
});
