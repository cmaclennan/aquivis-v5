import React from 'react';
import { UsersIcon, CalendarIcon, ClipboardCheckIcon } from 'lucide-react';
export function StatsOverview() {
  return <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Services</span>
          <div className="px-4 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
            18%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Completed</span>
          <div className="px-4 py-1 bg-cyan-400 text-white rounded-full text-sm font-medium">
            15%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Scheduled</span>
          <div className="px-4 py-1 bg-gray-300 text-gray-700 rounded-full text-sm font-medium">
            67%
          </div>
        </div>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-800 via-cyan-400 to-gray-300" style={{
          width: '100%'
        }}></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Efficiency</span>
          <div className="px-4 py-1 border border-gray-300 rounded-full text-sm font-medium">
            92%
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <UsersIcon className="w-6 h-6 text-gray-400" />
            <span className="text-5xl font-bold text-gray-800">124</span>
          </div>
          <p className="text-gray-600 mt-2">Active Clients</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <CalendarIcon className="w-6 h-6 text-gray-400" />
            <span className="text-5xl font-bold text-gray-800">38</span>
          </div>
          <p className="text-gray-600 mt-2">Today's Services</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <ClipboardCheckIcon className="w-6 h-6 text-gray-400" />
            <span className="text-5xl font-bold text-gray-800">856</span>
          </div>
          <p className="text-gray-600 mt-2">Total Services</p>
        </div>
      </div>
    </div>;
}