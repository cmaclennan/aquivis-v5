'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabaseClient';

interface Task {
  id: string;
  task_type: string;
  date: string;
  time_slot: string | null;
  priority: string;
  status: string;
  properties: { name: string } | null;
  units: { name: string } | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('scheduled_tasks')
          .select('*, properties(name), units(name)')
          .order('date', { ascending: true })
          .order('time_slot', { ascending: true })
          .limit(50);

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <AuthGuard>
      <main className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
          <PageHeader title="Tasks" subtitle="View scheduled tasks" />
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
                ) : tasks.length === 0 ? (
                  <EmptyState title="No tasks yet" description="Once you generate or schedule tasks, they'll appear here." />
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-700 border-b border-gray-200">
                        <th className="py-3 pr-4 font-semibold">Task</th>
                        <th className="py-3 pr-4 font-semibold">Property</th>
                        <th className="py-3 pr-4 font-semibold">Date</th>
                        <th className="py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-gray-900">{task.task_type}</p>
                            {task.units && <p className="text-sm text-gray-600">{task.units.name}</p>}
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-sm text-gray-600">{task.properties?.name || '—'}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-sm text-gray-600">
                              {new Date(task.date).toLocaleDateString()}
                              {task.time_slot && ` • ${task.time_slot}`}
                            </p>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              task.status === 'completed' ? 'bg-success/10 text-success' :
                              task.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.status}
                            </span>
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


