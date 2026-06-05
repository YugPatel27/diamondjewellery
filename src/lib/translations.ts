// Simple translation object for the application
const translations = {
  index: {
    newCollection: "New Collection",
    chooseType: "Choose Your Diamond Type",
    naturalTitle: "Natural Diamonds",
    naturalDesc: "Timeless beauty formed deep within the earth",
    labTitle: "Lab-Grown Diamonds",
    labDesc: "Eco-friendly luxury with identical brilliance",
    serviceTitle: "Expert Support",
    serviceDesc: "Personalized assistance from our jewelry specialists",
    certifiedTitle: "Certified Quality",
    certifiedDesc: "All diamonds certified for authenticity and quality",
    deliveryTitle: "Secure Delivery",
    deliveryDesc: "Insured shipping with real-time tracking",
  },
};

export const t = (key: string, defaultValue?: string) => {
  const keys = key.split(".");
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || defaultValue || key;
};

export default translations;
