async function fetchTasks() {
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  const res = await fetch(`${base}/api/tasks`, { cache: 'no-store' });
  const timing = res.headers.get('server-timing') || '';
  const data = await res.json();
  return { data, timing } as { data: { items: any[] }, timing: string };
}

export default async function TasksPage() {
  const { data, timing } = await fetchTasks();
  return (
    <main style={{ padding: 24 }}>
      <h1>Task Inbox (mock)</h1>
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
  );
}

