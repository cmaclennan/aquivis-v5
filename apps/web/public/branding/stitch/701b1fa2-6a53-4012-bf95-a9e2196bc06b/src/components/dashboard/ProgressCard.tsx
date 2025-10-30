import React from 'react';
import { ArrowUpRightIcon } from 'lucide-react';
export function ProgressCard() {
  const weekData = [{
    day: 'M',
    hours: 6.5,
    label: '6.5h'
  }, {
    day: 'T',
    hours: 7.2,
    label: '7.2h'
  }, {
    day: 'W',
    hours: 5.8,
    label: '5.8h'
  }, {
    day: 'T',
    hours: 6.1,
    label: '6.1h'
  }, {
    day: 'F',
    hours: 8.3,
    label: '8.3h',
    highlight: true
  }, {
    day: 'S',
    hours: 0,
    label: ''
  }, {
    day: 'S',
    hours: 0,
    label: ''
  }];
  const maxHours = Math.max(...weekData.map(d => d.hours));
  return <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Progress</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-800">33.8h</span>
            <div>
              <p className="text-sm text-gray-600">Service Time</p>
              <p className="text-xs text-gray-500">this week</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowUpRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex items-end justify-between h-32 gap-2">
        {weekData.map((data, index) => <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full flex items-end justify-center h-24">
              {data.hours > 0 && <>
                  <div className={`w-full rounded-full ${data.highlight ? 'bg-cyan-400' : 'bg-gray-800'}`} style={{
              height: `${data.hours / maxHours * 100}%`
            }}></div>
                  {data.highlight && <div className="absolute -top-6 bg-cyan-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {data.label}
                    </div>}
                </>}
            </div>
            <span className="text-xs text-gray-600">{data.day}</span>
          </div>)}
      </div>
    </div>;
}