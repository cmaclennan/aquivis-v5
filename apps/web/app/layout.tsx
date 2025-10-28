export const metadata = {
  title: 'Aquivis',
  description: 'Pool Service Management'
};

import SessionBar from '../components/SessionBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
          <a href="/">Aquivis</a>
          <a href="/tasks">Tasks</a>
          <a href="/properties">Properties</a>
          <div style={{ marginLeft: 'auto' }}>
            {/* @ts-expect-error Server does not know client state */}
            <SessionBar />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

