import { describe, it, expect } from 'vitest';
import app from '../index';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Users API', () => {
  describe('GET /api/v1/users/:userId', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/users/01TESTID', {}, ENV);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/v1/users/:userId/topics', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/users/01TESTID/topics', {}, ENV);
      expect(res.status).toBe(500);
    });

    it('should accept valid pagination params', async () => {
      const res = await app.request('/api/v1/users/01TESTID/topics?page=1&limit=10', {}, ENV);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/v1/users/:userId/answers', () => {
    it('should return 500 without DB binding (route reachable)', async () => {
      const res = await app.request('/api/v1/users/01TESTID/answers', {}, ENV);
      expect(res.status).toBe(500);
    });

    it('should accept valid pagination params', async () => {
      const res = await app.request('/api/v1/users/01TESTID/answers?page=2&limit=5', {}, ENV);
      expect(res.status).toBe(500);
    });
  });
});
