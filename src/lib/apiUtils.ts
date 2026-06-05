// Type-safe API error handling
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Retry logic for failed requests
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

// Debounced API calls
export const debounceAPI = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delay = 300
): ((...args: T) => Promise<R>) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: T) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args).then(resolve).catch(reject);
      }, delay);
    });
  };
};

// Cache for API responses
export class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl = this.defaultTTL) {
    this.cache.set(key, { data, timestamp: Date.now() + ttl });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  invalidate(pattern: string) {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const apiCache = new APICache();

// Rate limiting for API calls
export class RateLimiter {
  private calls: number[] = [];
  private maxCalls: number;
  private timeWindow: number;

  constructor(maxCalls = 30, timeWindow = 60000) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindow;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);

    if (this.calls.length >= this.maxCalls) {
      const oldestCall = this.calls[0];
      const waitTime = this.timeWindow - (now - oldestCall);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.execute(fn);
    }

    this.calls.push(now);
    return fn();
  }
}

export const apiLimiter = new RateLimiter(30, 60000); // 30 calls per minute
