import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    // Check database connection
    const supabase = await createServerClient(true); // Use service role for health check
    const { error } = await supabase.from('companies').select('count').limit(1);
    
    const status = {
      status: error ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: error ? 'unhealthy' : 'healthy',
        api: 'healthy',
      },
    };

    return NextResponse.json(status, { 
      status: error ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'unhealthy',
          api: 'degraded',
        },
      },
      { status: 503 }
    );
  }
}

