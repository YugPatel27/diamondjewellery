export const storageKeys = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  PREFERENCES: 'preferences',
};

export const storage = {
  // Generic operations
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  get: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  // Specific operations
  setAuthToken: (token: string) => {
    storage.set(storageKeys.AUTH_TOKEN, token);
  },

  getAuthToken: () => {
    return storage.get(storageKeys.AUTH_TOKEN);
  },

  setUser: (user: any) => {
    storage.set(storageKeys.USER, user);
  },

  getUser: () => {
    return storage.get(storageKeys.USER);
  },

  clearAuth: () => {
    storage.remove(storageKeys.AUTH_TOKEN);
    storage.remove(storageKeys.USER);
  },
};

export default storage;
