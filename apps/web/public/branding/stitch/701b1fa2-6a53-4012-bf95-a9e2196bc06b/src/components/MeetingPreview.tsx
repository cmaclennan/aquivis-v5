import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClipboardCheckIcon, DropletIcon, BellIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export function MeetingPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const features = [{
    title: 'Schedule Pool Services',
    description: 'Easily manage and schedule all your pool maintenance appointments in one place',
    icon: CalendarIcon,
    image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=1000&fit=crop',
    color: 'from-cyan-500 to-blue-500'
  }, {
    title: 'Track Chemical Levels',
    description: 'Monitor water chemistry and receive alerts when adjustments are needed',
    icon: DropletIcon,
    image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800&h=1000&fit=crop',
    color: 'from-teal-500 to-cyan-500'
  }, {
    title: 'Service Checklists',
    description: 'Complete detailed service checklists and maintain comprehensive records',
    icon: ClipboardCheckIcon,
    image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=1000&fit=crop',
    color: 'from-blue-500 to-teal-500'
  }, {
    title: 'Smart Notifications',
    description: 'Get automated reminders for upcoming services and maintenance tasks',
    icon: BellIcon,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop',
    color: 'from-cyan-600 to-blue-600'
  }];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % features.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + features.length) % features.length);
  };
  const CurrentIcon = features[currentSlide].icon;
  return <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
      <div className="absolute inset-0">
        <img src={features[currentSlide].image} alt={features[currentSlide].title} className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
      </div>
      <div className="relative h-full flex flex-col justify-center items-center p-12 lg:p-16">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${features[currentSlide].color} flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/30`}>
          <CurrentIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          {features[currentSlide].title}
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-md mb-12">
          {features[currentSlide].description}
        </p>
        <div className="flex gap-2 mb-8">
          {features.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-gradient-to-r from-cyan-500 to-teal-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />)}
        </div>
        <div className="flex gap-4">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center shadow-lg transition-all border border-gray-200">
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center shadow-lg transition-all border border-gray-200">
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>;
}