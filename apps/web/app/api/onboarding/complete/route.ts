import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyName, timezone } = body as { companyName: string; timezone: string };
  if (!companyName) return NextResponse.json({ error: 'companyName required' }, { status: 400 });

  // Using service role for bootstrap (server-side)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Server not configured: SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 });
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Get current user via Authorization: Bearer or cookie fallback
  const authz = req.headers.get('authorization');
  const bearer = authz?.toLowerCase().startsWith('bearer ')
    ? authz.split(' ')[1]
    : req.cookies.get('sb-access-token')?.value;
  if (!bearer) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data: userInfo, error: userErr } = await supabase.auth.getUser(bearer);
  if (userErr || !userInfo.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Create company and link profile
  const { data: company, error: cErr } = await supabase
    .from('companies')
    .insert({ name: companyName, timezone: timezone || 'UTC' })
    .select('id')
    .single();
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  // Upsert profile with company and default role owner
  const { error: pErr } = await supabase
    .from('profiles')
    .upsert({ id: userInfo.user.id, email: userInfo.user.email, role: 'owner', company_id: company.id });
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}


