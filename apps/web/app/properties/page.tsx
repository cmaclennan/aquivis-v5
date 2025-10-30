'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import EmptyState from '@/components/ui/EmptyState';

interface Property {
  id: string;
  name: string;
  address: string | null;
  has_individual_units: boolean;
  timezone: string | null;
  created_at: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <AuthGuard>
      <main className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
          <PageHeader title="Properties" subtitle="Manage properties and units" actions={<a href="/properties/new" className="btn">New Property</a>} />
          <Card>
            <CardBody>
              <div className="overflow-auto">
                {loading ? (
                  <div className="py-12">
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="py-12">
                    <p className="text-danger text-center">{error}</p>
                  </div>
                ) : properties.length === 0 ? (
                  <EmptyState 
                    title="No properties yet"
                    description="Create your first property to get started with managing units and services."
                    actionLabel="Add Property"
                    onAction={() => window.location.href = '/properties/new'}
                  />
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-700 border-b border-gray-200">
                        <th className="py-3 pr-4 font-semibold">Property</th>
                        <th className="py-3 pr-4 font-semibold">Address</th>
                        <th className="py-3 pr-4 font-semibold">Units</th>
                        <th className="py-3 font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-gray-900">{property.name}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-sm text-gray-600">{property.address || '—'}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-sm text-gray-600">
                              {property.has_individual_units ? 'Yes' : 'No'}
                            </p>
                          </td>
                          <td className="py-3">
                            <p className="text-sm text-gray-600">
                              {new Date(property.created_at).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}


