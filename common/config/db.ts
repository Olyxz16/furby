import fs from 'node:fs';
import Database from 'better-sqlite3';

const MIGRATE = process.env.MIGRATE;
const MIGRATION_FILE = "./schema/schema.sql";

const db = new Database('data.db', {verbose: console.log});
db.pragma('foreign_keys = ON');

if(MIGRATE == "true") {
  const migration = fs.readFileSync(MIGRATION_FILE).toString();
  db.exec(migration);
}

export default db;
