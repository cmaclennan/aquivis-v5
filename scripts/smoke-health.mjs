#!/usr/bin/env node

const fetch = global.fetch || (await import('node-fetch')).default;

async function main() {
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    console.error('APP_URL or NEXT_PUBLIC_APP_URL must be set');
    process.exit(2);
  }
  const url = `${baseUrl.replace(/\/$/, '')}/api/health`;
  const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    console.error('Health check failed:', res.status, res.statusText);
    process.exit(1);
  }
  const data = await res.json().catch(() => ({}));
  if (!data || data.status !== 'ok') {
    console.error('Unexpected health response:', data);
    process.exit(1);
  }
  console.log('Health check OK');
}

main().catch((err) => {
  console.error('Health check error:', err);
  process.exit(1);
});
