async function fetchTasks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/tasks`, { cache: 'no-store' });
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
    </main>
  );
}

