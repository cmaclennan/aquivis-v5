import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
export function DashboardSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(['equipment']);
  const toggleSection = (section: string) => {
    setOpenSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };
  return <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
      <button onClick={() => toggleSection('chemicals')} className="w-full flex items-center justify-between text-left">
        <span className="font-semibold text-gray-800">Chemical Inventory</span>
        {openSections.includes('chemicals') ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
      </button>
      <button onClick={() => toggleSection('equipment')} className="w-full flex items-center justify-between text-left">
        <span className="font-semibold text-gray-800">Equipment</span>
        {openSections.includes('equipment') ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
      </button>
      {openSections.includes('equipment') && <div className="pl-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=100&h=100&fit=crop" alt="Equipment" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Pool Vacuum</p>
              <p className="text-xs text-gray-500">Model XR-2000</p>
            </div>
          </div>
        </div>}
      <button onClick={() => toggleSection('reports')} className="w-full flex items-center justify-between text-left">
        <span className="font-semibold text-gray-800">Monthly Reports</span>
        {openSections.includes('reports') ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
      </button>
      <button onClick={() => toggleSection('clients')} className="w-full flex items-center justify-between text-left">
        <span className="font-semibold text-gray-800">Client Preferences</span>
        {openSections.includes('clients') ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
      </button>
    </div>;
}