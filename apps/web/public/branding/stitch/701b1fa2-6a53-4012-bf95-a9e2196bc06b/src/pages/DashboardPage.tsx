import React from 'react';
import { DashboardNavigation } from '../components/dashboard/DashboardNavigation';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { ProfileCard } from '../components/dashboard/ProfileCard';
import { ProgressCard } from '../components/dashboard/ProgressCard';
import { TimeTrackerCard } from '../components/dashboard/TimeTrackerCard';
import { CalendarCard } from '../components/dashboard/CalendarCard';
import { TaskListCard } from '../components/dashboard/TaskListCard';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
export function DashboardPage() {
  return <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <DashboardNavigation />
      <div className="max-w-[1600px] mx-auto p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Welcome back, Alex
        </h1>
        <StatsOverview />
        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-3">
            <ProfileCard />
            <div className="mt-6">
              <DashboardSidebar />
            </div>
          </div>
          <div className="col-span-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <ProgressCard />
              <TimeTrackerCard />
            </div>
            <CalendarCard />
          </div>
          <div className="col-span-3">
            <TaskListCard />
          </div>
        </div>
      </div>
    </div>;
}