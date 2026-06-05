/**
 * Diamond Jewels - Brand Configuration
 * Store Information, Contact Details, and Branding
 */

export const BRAND_CONFIG = {
  // Brand Information
  name: 'Diamond Jewels',
  tagline: 'Luxury Diamond & Jewelry Collection',
  description: 'Exquisite jewelry pieces crafted with precision and passion. Your trusted destination for premium diamonds and timeless designs.',

  // Store Location & Address
  store: {
    name: 'Diamond Jewels',
    address: '123 Luxury Avenue, Jewel District',
    street: 'Elite Square',
    city: 'Luzum Neeliar',
    state: 'Island',
    pincode: 'W1A 1AA',
    country: 'Makabul',

    // Full formatted address for display
    fullAddress: '123 Luxury Avenue, Jewel District, Luzum Neeliar, Island',
    shortAddress: '123 Luxury Avenue, Luzum Neeliar',
  },

  // Contact Information
  contact: {
    email: 'contact@diamondjewels.com',
    phone: '+91-XXXXXXXXXX', // Add actual phone number
    hours: {
      weekday: '10:00 AM - 8:00 PM',
      weekend: '10:00 AM - 8:00 PM',
      closed: 'Monday (Every 2nd Monday)',
    },
  },

  // Social Media & Links
  socials: {
    facebook: 'https://facebook.com/diamondjewels',
    instagram: 'https://instagram.com/diamondjewels',
    whatsapp: 'https://wa.me/919876543210',
  },

  // SEO & Meta
  seo: {
    title: 'Diamond Jewels - Luxury Diamond & Jewelry Collection',
    description: 'Premium diamonds and jewelry collection. Get exquisite pieces for every occasion.',
    keywords: 'diamonds, jewelry, gold, rings, earrings, necklaces, luxury jewelry',
  },

  // Store Policies
  policies: {
    noReturn: 'Strict No-Return Policy',
    gst: 'All prices include GST (Goods & Service Tax)',
    delivery: 'Delivery charges will be informed by store employee',
    warranty: 'Authentic diamonds with proper certification',
    quality: 'Premium quality assurance on all pieces',
  },

  // Business Hours
  businessHours: [
    { day: 'Monday to Friday', opens: '10:00 AM', closes: '8:00 PM' },
    { day: 'Saturday & Sunday', opens: '10:00 AM', closes: '8:00 PM' },
    { day: 'Note', info: 'Closed on every 2nd Monday for inventory' },
  ],

  // Delivery Information
  delivery: {
    policy: 'Strict no-return policy applies',
    timing: 'Delivery charges will be informed by store employee',
    method: 'Safe and secure delivery to your doorstep',
  },
};

// Helper function to get full store address
export const getStoreAddress = (): string => {
  const { store } = BRAND_CONFIG;
  return `${store.address}, ${store.street}, ${store.city}, ${store.state} ${store.pincode}`;
};

// Helper function to get contact info
export const getContactInfo = () => {
  const { contact } = BRAND_CONFIG;
  return {
    email: contact.email,
    phone: contact.phone,
    hours: contact.hours,
  };
};

// Export for use in components
export default BRAND_CONFIG;
