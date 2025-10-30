import React from 'react';
import { PlayIcon, PauseIcon, RotateCcwIcon, ArrowUpRightIcon } from 'lucide-react';
export function TimeTrackerCard() {
  return <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Time tracker</h3>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowUpRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle cx="96" cy="96" r="88" stroke="#fbbf24" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 88 * 0.65} ${2 * Math.PI * 88}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">03:47</span>
            <span className="text-sm text-gray-600">Active Time</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <PlayIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <PauseIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-4 bg-gray-800 hover:bg-gray-900 rounded-full transition-colors">
          <RotateCcwIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>;
}