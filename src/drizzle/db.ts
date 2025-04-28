import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schemas';

export const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle({ client: sql, schema });

export default db;