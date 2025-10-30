import React from 'react';
import { SettingsIcon, BellIcon, UserIcon } from 'lucide-react';
export function DashboardNavigation() {
  const navItems = ['Dashboard', 'Clients', 'Schedule', 'Services', 'Inventory', 'Reports', 'Calendar', 'Invoices'];
  return <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800">AQUIVIS</span>
            </div>
            <div className="flex items-center gap-2">
              {navItems.map((item, index) => <button key={item} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${index === 0 ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
                  {item}
                </button>)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>;
}