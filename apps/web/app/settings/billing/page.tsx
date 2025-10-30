'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';
import { useToast } from '@/lib/toast';
import EmptyState from '@/components/ui/EmptyState';

interface Subscription {
  currentPlan: string;
  status: string;
  billingCycleAnchor: string | null;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: string;
  date: string;
  period_start: string | null;
  period_end: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingSubscribe, setLoadingSubscribe] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    async function loadSubscription() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Get user's company
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single();

        if (!profile?.company_id) {
          setLoading(false);
          return;
        }

        // Fetch subscription from database
        const { data: company } = await supabase
          .from('companies')
          .select('subscription_status')
          .eq('id', profile.company_id)
          .single();

        // TODO: Fetch actual subscription details from Stripe when subscription_status exists
        setSubscription({
          currentPlan: 'starter', // This should come from Stripe subscription metadata
          status: (company?.subscription_status as string) || 'inactive',
          billingCycleAnchor: new Date().toISOString(),
          cancelAtPeriodEnd: false,
        });

        // Load invoices
        await loadInvoices();
      } catch (err) {
        console.error('Error loading subscription:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, []);

  async function loadInvoices() {
    setLoadingInvoices(true);
    try {
      const res = await fetch('/api/billing/invoices');
      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Failed to load invoices');
        return;
      }

      setInvoices(data.invoices || []);
    } catch (err) {
      console.error('Error loading invoices:', err);
      showError('Failed to load invoices');
    } finally {
      setLoadingInvoices(false);
    }
  }

  function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  async function openPortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url as string;
      } else {
        showError(data.error || 'Failed to open billing portal');
      }
    } catch (err) {
      console.error('Error opening portal:', err);
      showError('Failed to open billing portal');
    } finally {
      setLoadingPortal(false);
    }
  }

  async function subscribe(priceId: string) {
    setLoadingSubscribe(priceId);
    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url as string;
      } else {
        showError(data.error || 'Failed to start subscription');
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      showError('Failed to start subscription');
    } finally {
      setLoadingSubscribe(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-base text-gray-600">Manage your subscription and billing</p>
        </div>
        <Card>
          <CardBody>
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentTier = subscription ? SUBSCRIPTION_TIERS.find(t => t.id === subscription.currentPlan) : null;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-base text-gray-600">Manage your subscription and billing</p>
      </div>

      {currentTier && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div>
                <p className="font-semibold text-gray-900">{currentTier.name}</p>
                <p className="text-sm text-gray-600">
                  ${(currentTier.amount / 100).toFixed(2)}/month
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {subscription?.cancelAtPeriodEnd ? 'Cancels at period end' : 'Active'}
                </p>
              </div>
                  <Button 
                variant="ghost"
                onClick={openPortal} 
                disabled={loadingPortal}
              >
                {loadingPortal ? 'Loading...' : 'Manage Billing & Payment Methods'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 border rounded-lg ${
                  tier.id === subscription?.currentPlan
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {tier.id === 'enterprise' ? 'Custom' : `$${(tier.amount / 100).toFixed(2)}`}
                  {tier.id !== 'enterprise' && (
                    <span className="text-sm text-gray-600 font-normal">/mo</span>
                  )}
                </p>
                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-success">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.id === subscription?.currentPlan ? (
                  <button className="btn btn-ghost w-full" disabled>
                    Current Plan
                  </button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => subscribe(tier.priceId)}
                    disabled={loadingSubscribe === tier.priceId}
                  >
                    {loadingSubscribe === tier.priceId ? 'Loading...' : tier.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
        </CardHeader>
        <CardBody>
          {loadingInvoices ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState
              title="No invoices yet"
              description="Your billing history will appear here once you have an active subscription"
            />
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">
                        {invoice.number || `Invoice ${invoice.id.slice(0, 8)}`}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        invoice.status === 'paid'
                          ? 'bg-success/10 text-success'
                          : invoice.status === 'open'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{formatDate(invoice.date)}</span>
                      {invoice.period_start && invoice.period_end && (
                        <>
                          <span>•</span>
                          <span>
                            {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </p>
                    {invoice.hosted_invoice_url && (
                      <Button
                        variant="ghost"
                        onClick={() => window.open(invoice.hosted_invoice_url!, '_blank')}
                      >
                        View
                      </Button>
                    )}
                    {invoice.invoice_pdf && (
                      <Button
                        variant="ghost"
                        onClick={() => window.open(invoice.invoice_pdf!, '_blank')}
                      >
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
