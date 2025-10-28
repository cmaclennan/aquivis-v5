export const metadata = {
  title: 'Aquivis',
  description: 'Pool Service Management'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

