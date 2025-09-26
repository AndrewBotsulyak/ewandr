import {AuthOptions} from "@vendure/core/dist/config/vendure-config";

export const authOptions: AuthOptions = {
  tokenMethod: ['bearer', 'cookie'],
  superadminCredentials: {
    identifier: 'superadmin',
    password: 'superadmin',
  },
};
