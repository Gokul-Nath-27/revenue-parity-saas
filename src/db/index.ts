import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.NEXT_APP_DATABASE_URL as string);
const db = drizzle({ client: sql });

export default db;
