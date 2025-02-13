import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const { POSTGRES_URL } = process.env;

if (!POSTGRES_URL) {
  throw new Error('One or more DB environment variables are not set');
}

export const client = postgres(POSTGRES_URL);
export const db = drizzle(client, { schema });
