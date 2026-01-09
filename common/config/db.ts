import { Pool } from 'pg';
import { config } from './config';
import fs from 'node:fs';

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

const MIGRATE = process.env.MIGRATE;
const MIGRATION_FILE = "./schema/schema.sql";

if(MIGRATE == "true") {
  (async () => {
    try {
        const client = await pool.connect();
        const migration = fs.readFileSync(MIGRATION_FILE).toString();
        await client.query(migration);
        client.release();
        console.log("Migration executed successfully");
    } catch(err) {
        console.error("Migration failed", err);
    }
  })();
}

export default pool;
