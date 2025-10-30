import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from '@/components/Nav';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Aquivis - Pool Service Management",
  description: "Streamline your pool service business with Aquivis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <ErrorBoundary>
          <ToastProvider>
            <Nav />
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
