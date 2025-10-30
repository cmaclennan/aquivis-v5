import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, AppleIcon } from 'lucide-react';
export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Amélie Laurent',
    email: 'amélielaurent7622@gmail.com',
    password: '********************'
  });
  return <div className="p-12 lg:p-16 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
            <div className="text-white font-bold text-xl">A</div>
          </div>
          <span className="text-2xl font-bold text-gray-800">AQUIVIS</span>
        </div>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Create an account
          </h1>
          <p className="text-gray-600">Sign up and get 30 day free trial</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Full name
            </label>
            <input type="text" value={formData.fullName} onChange={e => setFormData({
            ...formData,
            fullName: e.target.value
          })} className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-gray-800 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-gray-800 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-gray-800 transition-all" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/30">
            Submit
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
              <AppleIcon className="w-5 h-5" />
              <span className="text-gray-800 font-medium">Apple</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 rounded-2xl transition-colors border border-gray-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-gray-800 font-medium">Google</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-8 text-sm">
        <div className="text-gray-600">
          Have any account?{' '}
          <a href="#" className="text-cyan-600 hover:text-cyan-700 underline font-medium">
            Sign in
          </a>
        </div>
        <a href="#" className="text-gray-600 hover:text-gray-800 underline">
          Terms & Conditions
        </a>
      </div>
    </div>;
}