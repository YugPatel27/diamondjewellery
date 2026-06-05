// Frontend configuration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api'),
  ENVIRONMENT: import.meta.env.MODE,
  STRIPE_KEY: import.meta.env.VITE_STRIPE_KEY,
  SUPPORTED_CURRENCIES: ['INR', 'EUR', 'USD'] as const,
  DEFAULT_CURRENCY: 'INR',
  PAGE_SIZE: 12,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TOKEN_KEY: 'authToken',
  USER_KEY: 'user',
};

export const apiEndpoints = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCTS_SEARCH: '/products/search',
  
  // Cart
  CART: '/cart',
  CART_ADD: '/cart/add',
  CART_REMOVE: '/cart/remove',
  CART_UPDATE: '/cart/update',
  CART_CLEAR: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDERS_ADMIN: '/orders/admin/all',
  
  // Users
  USERS: '/users',
  WISHLIST: '/users/wishlist',
  WISHLIST_ADD: '/users/wishlist/add',
  WISHLIST_REMOVE: '/users/wishlist/remove',
  
  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_ADMIN: '/appointments/admin/all',
  
  // Activity
  ACTIVITY: '/activity',
  ACTIVITY_ADMIN: '/activity/admin/all',
};

export const productCategories = [
  'Rings',
  'Necklaces',
  'Earrings'
] as const;

export const productStyles = [
  'Solitaire',
  'Vintage',
  'Diamond Band',
  'Halo',
  'Trilogy'
] as const;

export const diamondShapes = [
  'Round',
  'Princess',
  'Cushion',
  'Oval',
  'Pear',
  'Emerald',
  'Heart',
  'Marquise'
] as const;

export const diamondClarity = [
  'FL',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2'
] as const;

export const diamondColor = [
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K'
] as const;

export default config;
