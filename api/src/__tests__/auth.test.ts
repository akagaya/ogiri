import { describe, it, expect } from 'vitest';
import app from '../index';
import { generateJwt } from '../lib/auth';

const ENV = { ALLOWED_ORIGIN: 'http://localhost:5173', JWT_SECRET: 'test-secret' };

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 400 for empty body', async () => {
      const res = await app.request('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }, ENV);
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid username (too short)', async () => {
      const res = await app.request('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'ab', display_name: 'Test', password: 'password123' }),
      }, ENV);
      expect(res.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const res = await app.request('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', display_name: 'Test' }),
      }, ENV);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 for empty body', async () => {
      const res = await app.request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }, ENV);
      expect(res.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const res = await app.request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser' }),
      }, ENV);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 204', async () => {
      const res = await app.request('/api/v1/auth/logout', {
        method: 'POST',
      }, ENV);
      expect(res.status).toBe(204);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await app.request('/api/v1/auth/me', {}, ENV);
      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await app.request('/api/v1/auth/me', {
        headers: { Cookie: 'token=invalid-token' },
      }, ENV);
      expect(res.status).toBe(401);
    });
  });
});
