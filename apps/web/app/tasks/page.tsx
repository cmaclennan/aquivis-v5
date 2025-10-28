import { createClient } from '@supabase/supabase-js';
import AuthGuard from '../../components/AuthGuard';

async function fetchTasks() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anon);
  const start = Date.now();
  const { data, error } = await supabase
    .from('scheduled_tasks')
    .select('id, date, time_slot, task_type, property_id, unit_id, status')
    .order('date', { ascending: true })
    .limit(20);
  const ms = Date.now() - start;
  if (error) {
    return { data: { items: [] }, timing: `err;dur=${ms}` };
  }
  const items = (data ?? []).map((r: any) => ({
    id: r.id,
    time: r.time_slot ?? '',
    property: String(r.property_id).slice(0, 8),
    status: r.status,
  }));
  return { data: { items }, timing: `db;dur=${ms}` };
}

export default async function TasksPage() {
  const { data, timing } = await fetchTasks();
  return (
    <AuthGuard>
      <main style={{ padding: 24 }}>
        <h1>Task Inbox</h1>
        <p>Server-Timing: {timing}</p>
        <ul>
          {data.items.map((t) => (
            <li key={t.id}>{t.time} · {t.property} · {t.status}</li>
          ))}
        </ul>
        <p style={{ marginTop: 16 }}>
          Not seeing content? Ensure NEXT_PUBLIC_APP_URL is set (e.g., http://localhost:3000).
        </p>
      </main>
    </AuthGuard>
  );
}

