import { NextRequest } from 'next/server';

// Mock scheduled_tasks read with Server-Timing measurement
export async function GET(req: NextRequest) {
  const start = performance.now();
  const url = new URL(req.url);
  const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const propertyId = url.searchParams.get('propertyId');

  // Mock data (fast)
  const items = [
    { id: '1', time: '08:00', property: 'Sea Temple – Main Pool', status: 'Due', date },
    { id: '2', time: '09:15', property: 'Sheraton – Villa 21', status: 'In Progress', date },
  ].filter((i) => !propertyId || i.property.includes(propertyId));

  const ms = Math.max(1, Math.round(performance.now() - start));
  return new Response(JSON.stringify({ items }), {
    headers: {
      'content-type': 'application/json',
      'server-timing': `app;dur=${ms}`,
    },
  });
}


