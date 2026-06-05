export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && regex.test(email.trim());
};

export const validatePassword = (password) => {
  // Enforce: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  if (typeof password !== 'string' || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[-\s]/g, '');
  const regex = /^[0-9]{10}$/;
  return regex.test(cleaned);
};

export const validatePincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

export const sanitizeUser = (user) => {
  const { password, __v, ...rest } = user.toObject();
  return rest;
};

export const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return response;
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatPrice = (amount, currency = 'INR') => {
  if (currency === 'INR') {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }
  return Number(amount).toLocaleString();
};

export const createPaginationMetadata = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
