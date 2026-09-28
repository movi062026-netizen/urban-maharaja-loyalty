const { createTokenBucketLimiter } = require('../../src/middleware/tokenBucketLimiter');

describe('Token Bucket Rate Limiter', () => {
  it('allows requests within capacity and attaches rate limit headers', async () => {
    const limiter = createTokenBucketLimiter({
      capacity: 3,
      refillRatePerSec: 1,
      bucketName: 'test:bucket:allow',
      keyGenerator: () => 'user-1',
    });

    const req = { ip: '127.0.0.1' };
    const headers = {};
    const res = {
      setHeader: (k, v) => { headers[k] = v; },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Request 1: remaining should be 2
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(headers['X-RateLimit-Limit']).toBe(3);
    expect(headers['X-RateLimit-Remaining']).toBe(2);

    // Request 2: remaining should be 1
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(headers['X-RateLimit-Remaining']).toBe(1);

    // Request 3: remaining should be 0
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(3);
    expect(headers['X-RateLimit-Remaining']).toBe(0);
  });

  it('rejects with 429 when bucket is depleted', async () => {
    const limiter = createTokenBucketLimiter({
      capacity: 2,
      refillRatePerSec: 0.1, // slow refill
      bucketName: 'test:bucket:deny',
      keyGenerator: () => 'user-2',
      errorMessage: 'Depleted',
    });

    const req = { ip: '192.168.1.1' };
    const headers = {};
    const res = {
      setHeader: (k, v) => { headers[k] = v; },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Consume 2 tokens
    await limiter(req, res, next);
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);

    // 3rd attempt: should return 429
    await limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'RATE_LIMIT',
        }),
      })
    );
    expect(headers['Retry-After']).toBeGreaterThanOrEqual(1);
  });
});
