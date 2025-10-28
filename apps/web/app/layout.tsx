export const metadata = {
  title: 'Aquivis',
  description: 'Pool Service Management'
};

import SessionBar from '../components/SessionBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/app/globals.css" />
        <header className="border-b border-neutral-300 bg-white">
          <div className="max-w-6xl mx-auto flex items-center gap-4 p-3">
            <a href="/" className="font-semibold">Aquivis</a>
            <a href="/tasks" className="btn-ghost">Tasks</a>
            <a href="/properties" className="btn-ghost">Properties</a>
            <div className="ml-auto">
              {/* @ts-expect-error Server does not know client state */}
              <SessionBar />
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}

