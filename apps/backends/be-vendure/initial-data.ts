import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
  defaultLanguage: LanguageCode.en,
  defaultZone: 'Europe',
  taxRates: [
    { name: 'Standard Tax', percentage: 20 },
    { name: 'Reduced Tax', percentage: 10 },
    { name: 'Zero Tax', percentage: 0 },
  ],
  paymentMethods: [],
  shippingMethods: [
    { name: 'Standard Shipping', price: 500 },
    { name: 'Express Shipping', price: 1000 },
    { name: 'Free Shipping', price: 0 },
  ],
  collections: [
    {
      name: 'Electronics',
    },
    {
      name: 'Fashion',
    },
    {
      name: 'Home',
    },
  ],
  countries: [
    { name: 'Austria', code: 'AT', zone: 'Europe' },
    { name: 'Germany', code: 'DE', zone: 'Europe' },
    { name: 'United Kingdom', code: 'GB', zone: 'Europe' },
    { name: 'France', code: 'FR', zone: 'Europe' },
    { name: 'Italy', code: 'IT', zone: 'Europe' },
    { name: 'Spain', code: 'ES', zone: 'Europe' },
    { name: 'United States', code: 'US', zone: 'Americas' },
    { name: 'Canada', code: 'CA', zone: 'Americas' },
  ],
};
