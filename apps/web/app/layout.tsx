export const metadata = {
  title: 'Aquivis',
  description: 'Pool Service Management'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
          <a href="/">Aquivis</a>
          <a href="/tasks">Tasks</a>
          <a href="/(auth)/login" style={{ marginLeft: 'auto' }}>Login</a>
        </header>
        {children}
      </body>
    </html>
  );
}

