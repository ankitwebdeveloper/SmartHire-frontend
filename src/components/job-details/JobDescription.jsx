import React from 'react';
import { CheckCircle2, Navigation, Heart, Info, ArrowRight } from 'lucide-react';

const JobDescription = ({ job }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Description Block */}
      <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">Job Description</h2>
        <div className="prose max-w-none text-slate-600 text-[15px] space-y-4 leading-relaxed whitespace-pre-wrap">
          {job.description || 'No description provided for this job.'}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-100 border-l-4 border-l-primary">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
           <Navigation className="w-5 h-5 text-primary" /> Key Responsibilities
        </h3>
        <ul className="space-y-4">
          {['Collaborate with cross-functional teams to define, design, and ship new features.', 'Ensure the performance, quality, and responsiveness of applications.', 'Identify and correct bottlenecks and fix bugs.', 'Help maintain code quality, organization, and automatization.'].map((req, i) => (
            <li key={i} className="flex gap-3 items-start text-slate-600 font-medium text-[15px]">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Requirements */}
      <div className="card p-6 md:p-8 bg-white shadow-sm border border-slate-100 border-l-4 border-l-accent">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
           <ArrowRight className="w-5 h-5 text-accent" /> Qualifications & Requirements
        </h3>
        <ul className="space-y-4">
          {['Proven software development experience and solid understanding of full lifecycle development.', 'Excellent knowledge of modern frontend frameworks, specifically React.', 'Familiarity with RESTful APIs to connect applications to back-end services.', 'Strong understanding of UI design principles and patterns.'].map((req, i) => (
            <li key={i} className="flex gap-3 items-start text-slate-600 font-medium text-[15px]">
              <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2 mr-1"></div>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits Block */}
      <div className="card p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
           <Heart className="w-5 h-5 text-red-500" /> Perks & Benefits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {['Comprehensive Health Insurance', 'Flexible Working Hours', 'Professional Development Budget', 'Paid Time Off (PTO) & Sick Days', 'Remote Work Setup Stipend', 'Annual Performance Bonuses'].map((ben, i) => (
              <div key={i} className="bg-white p-3.5 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3 hover:border-red-100 transition-colors">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <span className="text-sm font-semibold text-slate-700">{ben}</span>
              </div>
           ))}
        </div>
      </div>

      {/* Additional Info Block */}
      <div className="card p-6 md:p-8 bg-primary/5 shadow-sm border-none">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
           <Info className="w-5 h-5 text-primary" /> Additional Information
        </h3>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
           <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Company Stage</p>
              <p className="text-sm font-bold text-slate-800">Series B Startup</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Employment Type</p>
              <p className="text-sm font-bold text-slate-800">{job.type}</p>
           </div>
           <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Date Posted</p>
              <p className="text-sm font-bold text-slate-800">{job.postedAt}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
