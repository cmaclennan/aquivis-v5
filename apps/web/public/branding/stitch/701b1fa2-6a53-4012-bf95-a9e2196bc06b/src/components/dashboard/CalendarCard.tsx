import React from 'react';
export function CalendarCard() {
  const currentWeek = [{
    day: 'Mon',
    date: '22',
    services: []
  }, {
    day: 'Tue',
    date: '23',
    services: []
  }, {
    day: 'Wed',
    date: '24',
    services: [{
      time: '9:00 am',
      title: 'Weekly Pool Check',
      subtitle: 'Standard maintenance',
      attendees: 2
    }]
  }, {
    day: 'Thu',
    date: '25',
    services: []
  }, {
    day: 'Fri',
    date: '26',
    services: [{
      time: '11:00 am',
      title: 'Chemical Balance',
      subtitle: 'pH adjustment needed',
      attendees: 2
    }]
  }, {
    day: 'Sat',
    date: '27',
    services: []
  }];
  return <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-600 hover:text-gray-800 font-medium">
          August
        </button>
        <h3 className="text-xl font-bold text-gray-800">September 2024</h3>
        <button className="text-gray-600 hover:text-gray-800 font-medium">
          October
        </button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {currentWeek.map((day, index) => <div key={index} className="text-center">
            <div className="text-sm text-gray-600 mb-2">{day.day}</div>
            <div className={`text-lg font-semibold mb-2 ${index === 2 ? 'text-gray-800' : 'text-gray-400'}`}>
              {day.date}
            </div>
          </div>)}
      </div>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-6 gap-4">
          {currentWeek.map((day, index) => <div key={index} className="min-h-[200px]">
              {day.services.map((service, serviceIndex) => <div key={serviceIndex} className="bg-gray-800 text-white rounded-2xl p-4 text-sm">
                  <div className="font-medium mb-1">{service.title}</div>
                  <div className="text-xs text-gray-300 mb-3">
                    {service.subtitle}
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(service.attendees)].map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-gray-800"></div>)}
                  </div>
                </div>)}
            </div>)}
        </div>
        <div className="grid grid-cols-8 gap-2 text-xs text-gray-500">
          <div>8:00 am</div>
          <div className="col-span-7 border-t border-gray-200"></div>
          <div>9:00 am</div>
          <div className="col-span-7 border-t border-gray-200"></div>
          <div>10:00 am</div>
          <div className="col-span-7 border-t border-gray-200"></div>
          <div>11:00 am</div>
          <div className="col-span-7 border-t border-gray-200"></div>
        </div>
      </div>
    </div>;
}