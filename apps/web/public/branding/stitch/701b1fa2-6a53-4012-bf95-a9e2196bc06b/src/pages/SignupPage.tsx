import React from 'react';
import { SignupForm } from '../components/SignupForm';
import { MeetingPreview } from '../components/MeetingPreview';
import { XIcon } from 'lucide-react';
export function SignupPage() {
  return <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative">
        <button className="absolute top-8 right-8 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg">
          <XIcon className="w-6 h-6 text-gray-700" />
        </button>
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          <SignupForm />
          <MeetingPreview />
        </div>
      </div>
    </div>;
}