import React from 'react';
import { CheckIcon, ZapIcon, ClipboardIcon, TrendingUpIcon, FileTextIcon } from 'lucide-react';
export function TaskListCard() {
  const tasks = [{
    icon: ClipboardIcon,
    title: 'Pool Inspection',
    time: 'Sep 13, 08:30',
    completed: true
  }, {
    icon: ZapIcon,
    title: 'Equipment Check',
    time: 'Sep 13, 10:30',
    completed: true
  }, {
    icon: ClipboardIcon,
    title: 'Chemical Test',
    time: 'Sep 13, 13:00',
    completed: false
  }, {
    icon: TrendingUpIcon,
    title: 'Review pH Levels',
    time: 'Sep 13, 14:45',
    completed: false
  }, {
    icon: FileTextIcon,
    title: 'Update Service Log',
    time: 'Sep 13, 16:30',
    completed: false
  }];
  return <div className="bg-white rounded-3xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Daily Tasks</h3>
        <span className="text-2xl font-bold text-gray-800">3/8</span>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 bg-cyan-400 rounded-full h-2"></div>
          <span className="text-sm text-gray-600">30%</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 bg-gray-800 rounded-full h-2"></div>
          <span className="text-sm text-gray-600">25%</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-300 rounded-full h-2"></div>
          <span className="text-sm text-gray-600">0%</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Service Checklist</h4>
          <span className="text-white text-sm">2/8</span>
        </div>
        <div className="space-y-3">
          {tasks.map((task, index) => {
          const Icon = task.icon;
          return <div key={index} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.completed ? 'bg-cyan-400' : 'bg-gray-700'}`}>
                  {task.completed ? <CheckIcon className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.time}</p>
                </div>
                {task.completed && <CheckIcon className="w-5 h-5 text-cyan-400" />}
              </div>;
        })}
        </div>
      </div>
    </div>;
}