import React from 'react';
import { MapPin, Briefcase, DollarSign, Bookmark, Code, Zap } from 'lucide-react';

const JobHeader = ({ job, saved, handleSave, handleApply }) => {
  // Mock skills array if missing
  const skills = job.skills || ['React', 'Node.js', 'MongoDB', 'TailwindCSS'];
  
  return (
    <div className="card p-6 md:p-8 w-full border-t-4 border-t-primary shadow-sm bg-white relative mb-8 overflow-visible">
      {/* Urgently Hiring Badge */}
      <div className="absolute top-0 right-8 transform -translate-y-[60%] flex items-center gap-1.5 bg-red-100 text-red-700 font-bold px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider shadow-sm border border-red-200 z-10 animate-bounce">
         <Zap className="w-3.5 h-3.5 fill-current" />
         Urgently Hiring
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center w-full lg:w-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-slate-100 flex items-center justify-center p-3 bg-white shadow-sm shrink-0">
            <img src={job.logo} alt={job.company} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm md:text-base font-medium text-slate-500 mb-3">
               <span className="text-primary hover:underline cursor-pointer font-semibold">{job.company}</span>
               <span className="hidden sm:inline text-slate-300">•</span>
               <span className="flex items-center gap-1 text-slate-600"><MapPin className="w-4 h-4" /> {job.location}</span>
               <span className="hidden sm:inline text-slate-300">•</span>
               <span className="flex items-center gap-1 text-slate-600"><Briefcase className="w-4 h-4" /> {job.type}</span>
            </div>
            {/* Highlighted Salary */}
            <div className="flex items-center gap-2 mt-2">
               <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold text-lg flex items-center gap-1 border border-green-200 shadow-sm">
                 <DollarSign className="w-5 h-5" /> 
                 {job.salary !== 'Not specified' ? job.salary : 'Salary Undisclosed'}
               </div>
            </div>
          </div>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-4 lg:mt-0 shadow-[0_-20px_20px_-20px_rgba(0,0,0,0.05)] lg:shadow-none bg-white">
          <button onClick={handleSave} className={`p-4 rounded-xl border flex items-center justify-center transition-colors ${saved ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary'}`}>
            <Bookmark className="w-5 h-5 flex-shrink-0" />
          </button>
          <button onClick={handleApply} className="btn-primary py-4 px-8 text-lg w-full lg:w-auto shadow-md hover:shadow-lg hover:scale-105 transition-all font-semibold">
            Apply Now
          </button>
        </div>
      </div>

      {/* Tags Block Below Header */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
           <Code className="w-4 h-4 text-slate-500" /> Key Requirements & Skills
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 font-semibold text-xs rounded-md border border-slate-200">
             Remote / Office (Hybrid)
          </span>
          <span className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-md border border-primary/20">
             {job.experienceLevel || '1-3 Years Experience'}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 hidden sm:block"></div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-white text-slate-500 font-medium text-xs rounded-full border border-slate-200 shadow-sm transition-colors hover:border-primary/50">
                  {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobHeader;
