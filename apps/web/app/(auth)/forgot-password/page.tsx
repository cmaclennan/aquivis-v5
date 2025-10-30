'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { useToast } from '@/lib/toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showSuccess, showError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Failed to send reset email');
        return;
      }

      setSent(true);
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error('Error requesting password reset:', err);
      showError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardBody>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Reset Password</h1>
          <p className="text-base text-gray-600 mb-6">
            {sent 
              ? 'We\'ve sent a password reset link to your email. Please check your inbox.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button className="w-full" onClick={() => router.push('/login')}>
                Back to Login
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </main>
  );
}
