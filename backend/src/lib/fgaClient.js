import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';
import dotenv from 'dotenv';
dotenv.config();

export const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_AUTH_MODEL_ID,
  credentials: {
    method: CredentialsMethod.ClientCredentials,
    config: {
      apiTokenIssuer: 'auth.fga.dev',
      apiAudience: process.env.FGA_API_AUD,
      clientId: process.env.FGA_CLIENT_ID,
      clientSecret: process.env.FGA_CLIENT_SECRET,
    },
  }
});
