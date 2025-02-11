import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const { DB_HOSTNAME, DB_PORT, DB_DB_NAME, DB_USERNAME, DB_PASSWORD } =
  process.env;

if (!DB_HOSTNAME || !DB_PORT || !DB_DB_NAME || !DB_USERNAME || !DB_PASSWORD) {
  throw new Error('One or more DB environment variables are not set');
}

const connectionString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_DB_NAME}`;

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
