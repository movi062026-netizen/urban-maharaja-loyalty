const {
  createTokenBucketLimiter,
  user100PerMinuteLimiter,
} = require('../../src/middleware/tokenBucketLimiter');

describe('Token Bucket Rate Limiter — 100 Requests/Min', () => {
  it('allows exactly 100 requests and rejects the 101st request with 429', async () => {
    const userId = 'user-test-100-' + Date.now();
    const req = { user: { id: userId }, headers: {} };
    let statusCalled = null;
    let jsonCalled = null;
    const res = {
      setHeader: jest.fn(),
      status: jest.fn((code) => {
        statusCalled = code;
        return { json: (body) => { jsonCalled = body; } };
      }),
    };
    const next = jest.fn();

    // Send 100 requests in rapid succession
    for (let i = 1; i <= 100; i++) {
      await user100PerMinuteLimiter(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(100);
    expect(res.status).not.toHaveBeenCalled();

    // 101st request should be rejected with 429
    await user100PerMinuteLimiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(100); // not incremented
    expect(statusCalled).toBe(429);
    expect(jsonCalled).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'RATE_LIMIT',
        }),
      })
    );
  });

  it('guarantees that User A reaching the limit does not affect User B', async () => {
    const userA = 'userA-' + Date.now();
    const userB = 'userB-' + Date.now();

    const reqA = { user: { id: userA }, headers: {} };
    const reqB = { user: { id: userB }, headers: {} };

    const resA = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const resB = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const nextA = jest.fn();
    const nextB = jest.fn();

    // Exhaust User A's bucket (100 requests)
    for (let i = 0; i < 100; i++) {
      await user100PerMinuteLimiter(reqA, resA, nextA);
    }
    // 101st request for User A is rejected
    await user100PerMinuteLimiter(reqA, resA, nextA);
    expect(nextA).toHaveBeenCalledTimes(100);
    expect(resA.status).toHaveBeenCalledWith(429);

    // User B sends a request — MUST be allowed with full bucket
    await user100PerMinuteLimiter(reqB, resB, nextB);
    expect(nextB).toHaveBeenCalledTimes(1);
    expect(resB.status).not.toHaveBeenCalled();
  });

  it('handles concurrent requests safely without race conditions bypassing the limit', async () => {
    const userConcurrent = 'user-concurrent-' + Date.now();
    const req = { user: { id: userConcurrent }, headers: {} };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    let allowedCount = 0;
    let rejectedCount = 0;

    // Fire 110 requests simultaneously
    const promises = Array.from({ length: 110 }, async () => {
      let allowed = false;
      const localNext = () => { allowed = true; };
      const localRes = {
        setHeader: jest.fn(),
        status: () => ({ json: () => {} }),
      };
      await user100PerMinuteLimiter(req, localRes, localNext);
      if (allowed) allowedCount++;
      else rejectedCount++;
    });

    await Promise.all(promises);

    expect(allowedCount).toBe(100);
    expect(rejectedCount).toBe(10);
  });

  it('tokens gradually refill over time', async () => {
    // 5 tokens capacity, 10 tokens/sec refill (fast refill for testing)
    const fastLimiter = createTokenBucketLimiter({
      capacity: 5,
      refillRatePerSec: 10,
      bucketName: 'test:refill:' + Date.now(),
      keyGenerator: () => 'refill-user',
    });

    const req = { ip: '127.0.0.1', headers: {} };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Consume all 5 tokens
    for (let i = 0; i < 5; i++) {
      await fastLimiter(req, res, next);
    }
    expect(next).toHaveBeenCalledTimes(5);

    // 6th request fails immediately
    await fastLimiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(5);

    // Wait 250ms -> at 10 tokens/sec, replenishes 2.5 tokens (floored to 2 available)
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Next request should now succeed
    await fastLimiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(6);
  });
});
