import { existsSync } from 'fs';

// Loads local overrides from .env; existing environment variables are not replaced.
if (existsSync('.env')) process.loadEnvFile('.env');

// Credentials and URL are kept outside the test bodies.
export const credentials = {
  standardUser: process.env.STANDARD_USER || 'standard_user',
  lockedOutUser: process.env.LOCKED_OUT_USER || 'locked_out_user',
  password: process.env.SAUCE_PASSWORD || 'secret_sauce'
};

// Logged-in session saved by tests/auth.setup.ts; gitignored.
export const storageStatePath = '.auth/standard-user.json';
