const buckets = new Map();

const cleanupBucket = (entries, now, windowMs) => entries.filter((timestamp) => now - timestamp < windowMs);

export const createRateLimiter = ({
  windowMs = 60_000,
  max = 10,
  message = "Too many requests, please try again later.",
  keyResolver,
} = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const keyBase = typeof keyResolver === "function" ? keyResolver(req) : req.ip;
    const key = `${req.userId || "anon"}:${keyBase}:${req.method}:${req.originalUrl}`;

    const existing = buckets.get(key) || [];
    const recent = cleanupBucket(existing, now, windowMs);

    if (recent.length >= max) {
      return res.status(429).json({ success: false, message });
    }

    recent.push(now);
    buckets.set(key, recent);
    next();
  };
};

