import { supabase } from '../../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.redirect('/(auth)/login');
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return NextResponse.redirect('/tasks');
  } catch {
    return NextResponse.redirect('/(auth)/login');
  }
}


