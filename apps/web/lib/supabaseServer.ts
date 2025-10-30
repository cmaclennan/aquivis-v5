import { createServerClient as createSSRClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Create server-side Supabase client for API routes
// Uses service role for admin operations, or user session for RLS-respecting queries
export async function createServerClient(useServiceRole = false, req?: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  
  if (useServiceRole) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
    return createClient(url, serviceKey);
  }
  
  // For API routes, read cookies from request headers
  // Note: We use the deprecated interface for API routes since we manually parse cookies
  if (req) {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookieMap: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.trim().split('=');
      if (parts.length >= 2) {
        cookieMap[parts[0]] = parts.slice(1).join('=');
      }
    });
    
    return createSSRClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
      cookies: {
        get(name: string) {
          return cookieMap[name];
        },
      },
    });
  }
  
  // For server components/pages, use next/headers cookies  
  const cookieStore = await cookies();
  
  return createSSRClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle cookie setting
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Handle cookie removal
        }
      },
    },
  });
}

// Get current authenticated user for API routes
// IMPORTANT: Use getUser() instead of getSession() for security
// getUser() verifies the token with the auth server, while getSession() reads from cookies (insecure)
export async function getServerUser(req?: NextRequest) {
  const supabase = await createServerClient(false, req);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// Get current user's session for API routes (DEPRECATED - use getServerUser instead)
// Kept for backward compatibility but should be migrated
export async function getServerSession(req?: NextRequest) {
  const supabase = await createServerClient(false, req);
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Get company_id from user metadata (set by our trigger)
export async function getCompanyId(req?: NextRequest): Promise<string | null> {
  const user = await getServerUser(req);
  if (!user?.user_metadata?.company_id) {
    // Fallback: lookup from profile
    const supabase = await createServerClient(false, req);
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user?.id)
      .single();
    return profile?.company_id || null;
  }
  return user.user_metadata.company_id;
}

// Get user's role
export async function getUserRole(req?: NextRequest): Promise<string | null> {
  const user = await getServerUser(req);
  return user?.user_metadata?.role || null;
}
