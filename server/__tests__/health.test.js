import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../index.js'

describe('Health Check API', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200)

    expect(response.body.status).toBe('OK')
    expect(response.body.message).toBe('Server is running')
  })
})
