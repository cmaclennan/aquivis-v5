'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/lib/toast';

interface Activity {
  id: string;
  entity_type: string;
  entity_name: string;
  user: {
    email: string;
    name: string;
  };
  timestamp: string;
  action: string;
  category: string;
  details: any;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const { showError } = useToast();

  useEffect(() => {
    async function loadActivities() {
      try {
        const url = category === 'all' 
          ? '/api/activity'
          : `/api/activity?category=${category}`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          showError(data.error || 'Failed to load activity log');
          return;
        }

        setActivities(data.activities || []);
      } catch (err) {
        console.error('Error loading activities:', err);
        showError('Failed to load activity log');
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [category, showError]);

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function getActionLabel(activity: Activity): string {
    if (activity.category === 'company') {
      return activity.action === 'created' ? 'Company created' : 'Company updated';
    }
    if (activity.category === 'team') {
      if (activity.action === 'created') {
        return `Added team member: ${activity.details.name || activity.entity_name}`;
      }
      return `Updated team member: ${activity.details.name || activity.entity_name}`;
    }
    return `${activity.action} ${activity.entity_type}`;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
          <p className="text-base text-gray-600">Track changes to your company and team</p>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Activities</option>
          <option value="company">Company Changes</option>
          <option value="team">Team Changes</option>
        </select>
      </div>

      {loading ? (
        <Card>
          <CardBody>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            {activities.length === 0 ? (
              <EmptyState
                title="No activity yet"
                description="Activity will appear here as changes are made to your company and team"
              />
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {activity.user.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {getActionLabel(activity)}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        by {activity.user.name} ({activity.user.email})
                      </p>
                      {activity.details && activity.category === 'team' && activity.details.role && (
                        <p className="text-xs text-gray-500 mt-1">
                          Role: <span className="capitalize font-medium">{activity.details.role}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

