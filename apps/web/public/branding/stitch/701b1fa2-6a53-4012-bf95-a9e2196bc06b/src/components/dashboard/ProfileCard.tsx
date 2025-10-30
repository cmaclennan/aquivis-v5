import React from 'react';
export function ProfileCard() {
  return <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <div className="relative h-64">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="Technician" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white text-2xl font-bold">Marcus Chen</h3>
          <p className="text-white/90 text-sm">Lead Technician</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Weekly Revenue</span>
          <span className="text-2xl font-bold text-gray-800">$3,450</span>
        </div>
      </div>
    </div>;
}