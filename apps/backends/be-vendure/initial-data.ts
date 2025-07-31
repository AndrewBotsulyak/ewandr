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
  ],
  collections: [
    {
      name: 'Electronics',
      filters: [
        {
          code: 'facet-value-filter',
          args: { facetValueNames: ['Electronics'], containsAny: false },
        },
      ],
    },
  ],
  countries: [
    { name: 'Austria', code: 'AT', zone: 'Europe' },
    { name: 'Germany', code: 'DE', zone: 'Europe' },
    { name: 'United Kingdom', code: 'GB', zone: 'Europe' },
  ],
};
