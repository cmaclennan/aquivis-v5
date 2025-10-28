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
      <main>
        <h1 className="text-xl font-semibold mb-4">Task Inbox</h1>
        <div className="text-sm text-neutral-700 mb-3">Server-Timing: {timing}</div>
        {data.items.length === 0 ? (
          <div className="card p-6">
            <h2 className="font-medium mb-1">No tasks yet</h2>
            <p className="text-neutral-700">Create properties and scheduling templates to see tasks here.</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {data.items.map((t) => (
              <li key={t.id} className="card p-3 flex items-center gap-3">
                <span className="pill pill-info">{t.time || '—'}</span>
                <span className="font-medium">{t.property}</span>
                <span className="ml-auto text-neutral-700">{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AuthGuard>
  );
}

