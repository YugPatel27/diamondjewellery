const buckets = new Map();

const CLEANUP_INTERVAL_MS = 5 * 60_000;

const pruneTimestamps = (timestamps, now, windowMs) =>
  timestamps.filter((timestamp) => now - timestamp < windowMs);

const sweepBuckets = (windowMs) => {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const recent = pruneTimestamps(timestamps, now, windowMs);
    if (recent.length === 0) {
      buckets.delete(key);
    } else {
      buckets.set(key, recent);
    }
  }
};

const defaultKeyResolver = (req) => req.ip;

export const createRateLimiter = ({
  windowMs = 60_000,
  max = 10,
  message = 'Too many requests, please try again later.',
  keyResolver = defaultKeyResolver,
  keyGenerator,
} = {}) => {
  const buildKey = keyGenerator || ((req) => `${req.userId || 'anon'}:${keyResolver(req)}:${req.method}:${req.originalUrl}`);

  const sweepHandle = setInterval(() => sweepBuckets(windowMs), CLEANUP_INTERVAL_MS);
  sweepHandle.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = buildKey(req);

    const existing = buckets.get(key) || [];
    const recent = pruneTimestamps(existing, now, windowMs);

    const remaining = Math.max(0, max - recent.length - 1);
    const resetAt = recent.length > 0 ? recent[0] + windowMs : now + windowMs;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000));

    if (recent.length >= max) {
      const retryAfterSeconds = Math.ceil((resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({ success: false, message });
    }

    recent.push(now);
    buckets.set(key, recent);
    return next();
  };
};