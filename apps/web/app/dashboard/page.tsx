'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import EmptyState from '@/components/ui/EmptyState';

interface DashboardMetrics {
  tasksCompleted: number;
  tasksToday: number;
  propertiesCount: number;
  pendingTasks: number;
}

interface Task {
  id: string;
  task_type: string;
  date: string;
  time_slot: string | null;
  properties: { name: string } | null;
  units: { name: string } | null;
}

interface Property {
  id: string;
  name: string;
  address: string | null;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    tasksCompleted: 0,
    tasksToday: 0,
    propertiesCount: 0,
    pendingTasks: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;

        // Fetch metrics
        const [tasksResult, completedTasksResult, propertiesResult] = await Promise.all([
          supabase
            .from('scheduled_tasks')
            .select('id')
            .eq('date', today)
            .eq('status', 'pending'),
          supabase
            .from('scheduled_tasks')
            .select('id')
            .eq('status', 'completed')
            .limit(100),
          supabase
            .from('properties')
            .select('id'),
        ]);

        setMetrics({
          tasksCompleted: completedTasksResult.data?.length || 0,
          tasksToday: tasksResult.data?.length || 0,
          propertiesCount: propertiesResult.data?.length || 0,
          pendingTasks: tasksResult.data?.length || 0,
        });

        // Fetch upcoming tasks
        const { data: tasksData } = await supabase
          .from('scheduled_tasks')
          .select('*, properties(name), units(name)')
          .eq('date', today)
          .eq('status', 'pending')
          .order('time_slot', { ascending: true })
          .limit(5);

        setUpcomingTasks(tasksData || []);

        // Fetch recent properties
        const { data: propsData } = await supabase
          .from('properties')
          .select('id, name, address')
          .order('created_at', { ascending: false })
          .limit(3);

        setPendingProperties(propsData || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <AuthGuard>
      <main className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-8 lg:px-10 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-base text-gray-600">Overview of your operations</p>
              </div>
              <a href="/properties/new" className="btn flex items-center gap-2 h-12 px-6">
                Add Property
              </a>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody>
                <p className="text-xs text-gray-600 font-medium mb-1">Tasks Completed</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{metrics.tasksCompleted}</p>
                <p className="text-success text-sm font-semibold flex items-center gap-1">All time</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-gray-600 font-medium mb-1">Today's Tasks</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{metrics.tasksToday}</p>
                <p className="text-primary text-sm font-semibold flex items-center gap-1">Pending</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-gray-600 font-medium mb-1">Properties</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{metrics.propertiesCount}</p>
                <p className="text-gray-600 text-sm font-medium">Total active</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs text-gray-600 font-medium mb-1">Pending Tasks</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{metrics.pendingTasks}</p>
                <p className="text-warning text-sm font-semibold flex items-center gap-1">Requires action</p>
              </CardBody>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Card>
                <CardBody>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Upcoming Tasks</h3>
                  <p className="text-base text-gray-600">Today's scheduled tasks</p>
                </CardBody>
                {loading ? (
                  <div className="p-6">
                    <div className="h-16 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : upcomingTasks.length === 0 ? (
                  <div className="p-6">
                    <p className="text-gray-600 text-center">No upcoming tasks for today</p>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-200">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
                          📋
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{task.task_type}</p>
                          <p className="text-sm text-gray-600">{task.properties?.name || 'No property'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{task.time_slot || '—'}</p>
                          <p className="text-sm text-gray-600">Today</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-4">
                      <a className="w-full block text-center text-primary font-semibold text-sm hover:text-primary-hover transition-colors" href="/tasks">
                        View Full Schedule
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardBody>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Recent Properties</h3>
                  <p className="text-base text-gray-600">Latest properties added</p>
                </CardBody>
                {loading ? (
                  <div className="p-6">
                    <div className="h-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : pendingProperties.length === 0 ? (
                  <div className="p-6">
                    <p className="text-gray-600 text-center">No properties yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-200">
                    {pendingProperties.map((property) => (
                      <div key={property.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-semibold text-gray-900">{property.name}</p>
                          <p className="text-sm text-gray-600">{property.address || '—'}</p>
                        </div>
                        <a 
                          href={`/properties/${property.id}`}
                          className="text-sm font-semibold py-2 px-3 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors text-center"
                        >
                          View Details
                        </a>
                      </div>
                    ))}
                    <div className="p-4">
                      <a className="w-full block text-center text-primary font-semibold text-sm hover:text-primary-hover transition-colors" href="/properties">
                        View All Properties
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      </main>
    </AuthGuard>
  );
}

