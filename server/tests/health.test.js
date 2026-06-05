import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server.js';

describe('Server health and routing', () => {
  it('should return a healthy status on /api/health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Server is running',
    });
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('should return 404 for a missing API route', async () => {
    const response = await request(app).get('/api/nonexistent-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Route not found' });
  });
});
