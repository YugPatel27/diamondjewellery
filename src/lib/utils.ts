import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Comprehensive error handling utilities for the application
 */

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Handle API errors with standardized response
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    return {
      success: false,
      message: `HTTP ${error.status}: ${error.statusText}`,
      status: error.status,
      code: `HTTP_${error.status}`,
    };
  }

  if (error instanceof TypeError) {
    return {
      success: false,
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
    };
  }

  if (error instanceof SyntaxError) {
    return {
      success: false,
      message: 'Invalid server response',
      code: 'PARSE_ERROR',
    };
  }

  if (error instanceof Error) {
    if (error.message.includes('validation')) {
      return {
        success: false,
        message: error.message,
        code: 'VALIDATION_ERROR',
      };
    }

    return {
      success: false,
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    success: false,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: 'Password is strong' };
};

/**
 * Validate PAN format (Indian format)
 */
export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

/**
 * Validate Aadhaar format (Indian format)
 */
export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

/**
 * Validate GST format (Indian format)
 */
export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
};

/**
 * Safe JSON parse with error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

/**
 * Safe JSON stringify with error handling
 */
export const safeJsonStringify = (value: any, fallback = '{}'): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

/**
 * Retry logic for failed requests
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> => {
  let lastError: Error | unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(backoff, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private calls: number[] = [];
  private limit: number;
  private window: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter((time) => now - time < this.window);

    if (this.calls.length < this.limit) {
      this.calls.push(now);
      return true;
    }

    return false;
  }

  reset(): void {
    this.calls = [];
  }
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Format currency with proper locale
 */
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

/**
 * Format date with proper locale
 */
export const formatDate = (date: Date | string): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return new Date(date).toLocaleDateString();
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return new Date(date).toLocaleString();
  }
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Compare two objects
 */
export const objectsEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Merge objects deeply
 */
export const mergeDeep = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target } as any;

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key] as any);
    } else {
      result[key] = source[key];
    }
  }

  return result as T;
};
