import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const { RDS_HOSTNAME, RDS_PORT, RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD } =
  process.env;

if (
  !RDS_HOSTNAME ||
  !RDS_PORT ||
  !RDS_DB_NAME ||
  !RDS_USERNAME ||
  !RDS_PASSWORD
) {
  throw new Error('One or more DB environment variables are not set');
}

const connectionString = `postgres://${RDS_USERNAME}:${RDS_PASSWORD}@${RDS_HOSTNAME}:${RDS_PORT}/${RDS_DB_NAME}`;

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
