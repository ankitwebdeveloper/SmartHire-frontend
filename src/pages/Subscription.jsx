import React from 'react';
import { CheckCircle } from 'lucide-react';

const Subscription = () => {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
        <p className="text-slate-500 mt-2">Choose the perfect plan to scale your hiring process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="card p-8 border-2 border-transparent hover:border-primary/20 transition-all flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
          <p className="text-slate-500 text-sm mb-6">Perfect for small businesses.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">₹0</span>
            <span className="text-slate-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> 3 Active Jobs</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Setup Company Profile</li>
            <li className="flex items-center gap-3 text-slate-400 text-sm"><CheckCircle className="w-5 h-5 text-slate-300" /> Standard Support</li>
          </ul>
          <button className="btn-secondary w-full">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="card p-8 border-2 border-primary relative flex flex-col transform shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Most Popular
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
          <p className="text-slate-500 text-sm mb-6">For growing teams hiring fast.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">₹4,999</span>
            <span className="text-slate-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> 15 Active Jobs</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Highlighted Listings</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Access candidate resumes directly</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Priority email support</li>
          </ul>
          <button className="btn-primary w-full shadow-lg shadow-primary/30">Upgrade Now</button>
        </div>

        {/* Enterprise Plan */}
        <div className="card p-8 border-2 border-transparent hover:border-primary/20 transition-all flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
          <p className="text-slate-500 text-sm mb-6">Unlimited hiring power.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">₹14,999</span>
            <span className="text-slate-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Unlimited Active Jobs</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Dedicated Account Manager</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> Custom integrations</li>
            <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className="w-5 h-5 text-primary" /> 24/7 Phone Support</li>
          </ul>
          <button className="btn-secondary w-full">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
