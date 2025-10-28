#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { Client } from 'pg';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

const {
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD
} = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  console.error('Missing PG* environment variables.');
  process.exit(1);
}

const conn = {
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
};

async function runSql(client, sql, label) {
  console.log(`\n--- Running ${label} ---`);
  await client.query(sql);
  console.log(`--- Completed ${label} ---`);
}

async function main() {
  const client = new Client(conn);
  await client.connect();
  try {
    const init = await readFile('DB/schema/000_init.sql', 'utf8');
    const idx = await readFile('DB/schema/010_indices.sql', 'utf8');
    if (isDryRun) {
      await client.query('BEGIN');
      await runSql(client, init, '000_init.sql (dry)');
      await runSql(client, idx, '010_indices.sql (dry)');
      await client.query('ROLLBACK');
      console.log('\nDry run complete (rolled back).');
    } else {
      await runSql(client, init, '000_init.sql');
      await runSql(client, idx, '010_indices.sql');
      console.log('\nApply complete.');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

main();


