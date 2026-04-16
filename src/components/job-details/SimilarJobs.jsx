import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building } from 'lucide-react';

const SimilarJobs = ({ jobs, variant = 'vertical', loading = false }) => {
  if (loading) {
    return <p className="text-sm text-slate-500 font-medium p-4">Loading similar jobs...</p>;
  }

  if (!jobs || jobs.length === 0) {
    return <p className="text-sm text-slate-500 p-4">No similar jobs found right now.</p>;
  }

  // HORIZONTAL SCROLL LAYOUT
  if (variant === 'horizontal') {
    return (
      <div className="w-full mb-8 pt-4">
        <h3 className="text-xl font-bold text-slate-900 mb-5">More jobs you may like</h3>
        <div className="flex overflow-x-auto pb-6 gap-5 snap-x hide-scrollbar">
          {jobs.map(rj => (
            <Link key={rj.id} to={`/job/${rj.id}`} className="min-w-[300px] max-w-[300px] snap-start card p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-4 border border-slate-100 hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 border border-slate-100 shadow-sm shrink-0">
                  <img src={rj.logo} className="w-full h-full object-contain" alt={rj.company} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100 uppercase tracking-wide">{rj.type}</span>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-1">{rj.title}</h4>
                <p className="text-sm font-medium text-slate-500 line-clamp-1 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />{rj.company}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {rj.location}
                </div>
                <div className="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">
                  {rj.salary !== 'Not specified' ? rj.salary : 'Salary Undisclosed'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // VERTICAL SIDEBAR LAYOUT
  return (
    <div className="card shadow-md border border-slate-100 bg-white sticky top-28 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900">Similar Jobs</h3>
      </div>
      <div className="p-3 space-y-1">
        {jobs.slice(0, 5).map(rj => (
          <Link key={rj.id} to={`/job/${rj.id}`} className="block rounded-xl p-3 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-lg border border-slate-100 bg-white flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                <img src={rj.logo} className="w-full h-full object-contain" alt={rj.company} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{rj.title}</h4>
                <p className="text-[12px] font-medium text-slate-500 line-clamp-1">{rj.company}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2 py-1 rounded"><MapPin className="w-3 h-3" /> {rj.location}</span>
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 shadow-sm">{rj.salary !== 'Not specified' ? rj.salary : 'Undisclosed'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
