import { createClient } from '@supabase/supabase-js';
import AuthGuard from '../../components/AuthGuard';

export default async function PropertiesPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anon);
  const { data, error } = await supabase
    .from('properties')
    .select('id, name, address, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  const rows = error ? [] : (data ?? []);
  return (
    <AuthGuard>
      <main style={{ padding: 24 }}>
        <h1>Properties</h1>
        <a href="/properties/new">New Property</a>
        <ul>
          {rows.map((p: any) => (
            <li key={p.id}>{p.name} — {p.address || 'No address'}</li>
          ))}
        </ul>
      </main>
    </AuthGuard>
  );
}
