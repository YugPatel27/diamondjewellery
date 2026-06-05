const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api');

// Log API configuration for debugging
if (import.meta.env.MODE === 'development') {
  console.log(`[API] Base URL: ${API_BASE_URL}`);
}


export const apiClient = {
  baseURL: API_BASE_URL,
  async request(endpoint: string, options: any = {}) {
    const { responseType = 'json', headers: customHeaders = {}, ...fetchOptions } = options;
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${endpoint}`;


    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
      });

      let data;
      if (responseType === 'blob') {
        data = await response.blob();
      } else if (response.status === 204) {
        data = null;
      } else {
        data = await response.json();
      }

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionInfo');

        window.dispatchEvent(new CustomEvent('sessionExpired', {
          detail: { message: responseType === 'blob' ? 'Your session has expired. Please login again.' : data?.message || 'Your session has expired. Please login again.' }
        }));

        throw new Error(responseType === 'blob' ? 'Session expired. Please login again.' : data?.message || 'Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorMessage = responseType === 'blob'
          ? await response.text().catch(() => 'API request failed')
          : data?.message || 'API request failed';
        console.error(`[API Error] ${response.status} ${errorMessage}`);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  },

  get(endpoint, responseType = 'json') {
    return this.request(endpoint, { method: 'GET', responseType });
  },

  post(endpoint, body, responseType = 'json') {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), responseType });
  },

  put(endpoint, body, responseType = 'json') {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body), responseType });
  },

  delete(endpoint, responseType = 'json') {
    return this.request(endpoint, { method: 'DELETE', responseType });
  },

  patch(endpoint, body, responseType = 'json') {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body), responseType });
  },

  blob(endpoint) {
    return this.request(endpoint, { method: 'GET', responseType: 'blob' });
  },
};

// Auth APIs
export const authAPI = {
  register: (name, email, password, phone) =>
    apiClient.post('/auth/register', { name, email, password, phone }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getProfile: () =>
    apiClient.get('/auth/profile'),

  updateProfile: (data) =>
    apiClient.put('/auth/profile', data),
};

// Product APIs
export const productAPI = {
  getAll: (params = '') =>
    apiClient.get(`/products${params}`),

  getById: (id) =>
    apiClient.get(`/products/${id}`),

  search: (q) =>
    apiClient.get(`/products/search?q=${q}`),

  create: (data) =>
    apiClient.post('/products', data),

  update: (id, data) =>
    apiClient.put(`/products/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addItem: (productId: any, quantity = 1, customization?: any) => apiClient.post('/cart/add', { productId, quantity, customization }),
  removeItem: (productId: any, customization?: any) => apiClient.post('/cart/remove', { productId, customization }),
  updateItem: (productId: any, quantity: number, customization?: any) => apiClient.put('/cart/update', { productId, quantity, customization }),
  clear: () => apiClient.delete('/cart/clear'),
};

// Order APIs
export const orderAPI = {
    create: (data) =>
      apiClient.post('/orders', data),

    getMyOrders: () =>
      apiClient.get('/orders'),

    getOrderById: (id) =>
      apiClient.get(`/orders/${id}`),

    getAllOrders: (status = '') =>
      apiClient.get(`/orders/admin/all${status ? `?status=${status}` : ''}`),

    updateStatus: (id, status) =>
      apiClient.put(`/orders/${id}/status`, { status }),

    cancelOrder: (id) =>
      apiClient.put(`/orders/${id}/cancel`, {}),

    confirmOrder: (id, trackingNumber = '') =>
      apiClient.put(`/orders/${id}/confirm`, { trackingNumber }),

    addTrackingNumber: (id, trackingNumber) =>
      apiClient.put(`/orders/${id}/tracking`, { trackingNumber }),

    updatePaymentStatus: (id, paymentStatus, paymentMethod, paymentVerificationToken = "") =>
      apiClient.put(`/orders/${id}/payment-status`, { paymentStatus, paymentMethod, paymentVerificationToken }),

    deleteOrder: (id) =>
      apiClient.delete(`/orders/${id}`),

    deleteMultipleOrders: (orderIds) =>
      apiClient.post('/orders/admin/delete-multiple', { orderIds }),

    downloadPDF: async (id) => {
      return apiClient.blob(`/orders/download/${id}`);
    },
  };

  // User APIs
  export const userAPI = {
    getAll: () =>
      apiClient.get('/users'),

    getById: (id) =>
      apiClient.get(`/users/${id}`),

    update: (id, data) =>
      apiClient.put(`/users/${id}`, data),

    delete: (id) =>
      apiClient.delete(`/users/${id}`),

    // Wishlist operations
    getWishlist: () =>
      apiClient.get('/users/wishlist'),

    addToWishlist: (productId) =>
      apiClient.post('/users/wishlist/add', { productId }),

    removeFromWishlist: (productId) =>
      apiClient.post('/users/wishlist/remove', { productId }),

    // Admin: Wishlist management
    getAllWishlists: () =>
      apiClient.get('/users/admin/wishlists/all'),

    getUserWishlistDetails: (userId) =>
      apiClient.get(`/users/admin/wishlist/${userId}`),

    // Likes management (admin)
    getAllProductLikes: () =>
      apiClient.get('/users/admin/likes/all'),

    updateProductLikes: (productId, likesCount) =>
      apiClient.put('/users/admin/likes/update', { productId, likesCount }),

    removeLike: (userId, productId) =>
      apiClient.post('/users/admin/likes/remove', { userId, productId }),

    // Admin: Delete operations
    deleteMultipleUsers: (userIds) =>
      apiClient.post('/users/admin/delete-multiple', { userIds }),

    deleteWishlistItem: (userId, productId) =>
      apiClient.delete(`/users/admin/wishlist/${userId}/${productId}`),

    deleteUserWishlist: (userId) =>
      apiClient.delete(`/users/admin/wishlist/${userId}`),

    // Search users by phone or email
    searchUsers: (query) =>
      apiClient.get(`/users/admin/search?q=${encodeURIComponent(query)}`),

    // Delete all likes
    deleteAllLikes: () =>
      apiClient.delete('/users/admin/likes/all'),

    // Delete likes by product
    deleteProductLikes: (productId) =>
      apiClient.delete(`/users/admin/likes/product/${productId}`),

    // Search wishlists by phone/email
    searchWishlists: (query) =>
      apiClient.get(`/users/admin/wishlists/search?q=${encodeURIComponent(query)}`),

    // Profile & Settings
    getProfile: () =>
      apiClient.get('/users/profile/current'),

    updateProfile: (data) =>
      apiClient.put('/users/profile/update', data),

    updatePreferences: (data) =>
      apiClient.put('/users/profile/preferences', data),

    // KYC Verification (admin)
    verifyUserKYC: (userId, data) =>
      apiClient.put(`/users/admin/kyc/${userId}`, data),
  };

  // Product Likes APIs (public)
  export const likesAPI = {
    getProductLikesCount: () =>
      apiClient.get('/products/likes/count'),
  };

  // Appointment APIs
  export const appointmentAPI = {
    create: (data) =>
      apiClient.post('/appointments', data),

    getBookedSlots: (date) =>
      apiClient.get(`/appointments/slots?date=${encodeURIComponent(date)}`),

    getMyAppointments: () =>
      apiClient.get('/appointments'),

    getAllAppointments: (status = '') =>
      apiClient.get(`/appointments/admin/all${status ? `?status=${status}` : ''}`),

    update: (id, status) =>
      apiClient.put(`/appointments/${id}`, { status }),

    delete: (id) =>
      apiClient.delete(`/appointments/${id}`),
  };

  // Activity APIs
  export const activityAPI = {
    createLog: (data) =>
      apiClient.post('/activity', data),

    getLogs: () =>
      apiClient.get('/activity'),

    getAllLogs: (action = '') =>
      apiClient.get(`/activity/admin/all${action ? `?action=${action}` : ''}`),

    deleteLog: (id) =>
      apiClient.delete(`/activity/admin/${id}`),

    deleteMultipleLogs: (ids) =>
      apiClient.post('/activity/admin/delete-multiple', { ids }),
  };

  // GDPR Compliance APIs
  export const gdprAPI = {
    /** Export all personal data (Right to Portability, GDPR Art. 20) */
    exportData: () =>
      apiClient.get('/gdpr/export'),

    /** Delete account and all personal data (Right to Erasure, GDPR Art. 17) */
    eraseData: (confirmEmail: string) =>
      apiClient.delete('/gdpr/erase'),

    /** Record consent preferences */
    updateConsent: (data: { dataProcessing: boolean; marketing: boolean; analytics: boolean }) =>
      apiClient.post('/gdpr/consent', data),

    /** Withdraw marketing/analytics consent */
    withdrawConsent: () =>
      apiClient.post('/gdpr/withdraw-consent', {}),

    /** Check current consent status */
    getConsentStatus: () =>
      apiClient.get('/gdpr/consent-status'),
  };

  export default apiClient;
