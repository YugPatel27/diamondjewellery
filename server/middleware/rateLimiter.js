const buckets = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60_000;

const prune = (timestamps, now, windowMs) =>
  timestamps.filter((t) => now - t < windowMs);

const sweepBuckets = (windowMs) => {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const recent = prune(timestamps, now, windowMs);
    recent.length ? buckets.set(key, recent) : buckets.delete(key);
  }
};

export const createRateLimiter = ({
  windowMs = 60_000,
  max = 10,
  message = 'Too many requests, please try again later.',
  keyResolver = (req) => req.ip,
  keyGenerator = (req) => `${req.userId || 'anon'}:${keyResolver(req)}:${req.method}:${req.originalUrl}`,
} = {}) => {
  setInterval(() => sweepBuckets(windowMs), CLEANUP_INTERVAL_MS).unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = keyGenerator(req);
    const recent = prune(buckets.get(key) || [], now, windowMs);
    const resetAt = recent.length ? recent[0] + windowMs : now + windowMs;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recent.length - 1));
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000));

    if (recent.length >= max) {
      res.setHeader('Retry-After', Math.ceil((resetAt - now) / 1000));
      return res.status(429).json({ success: false, message });
    }

    recent.push(now);
    buckets.set(key, recent);
    return next();
  };
};