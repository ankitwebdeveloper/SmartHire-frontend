import React, { useState } from 'react';
import { Bookmark, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import ApplyJobModal from '../components/ApplyJobModal';

const SavedJobs = () => {
  const { isAuthenticated, userRole } = useAuth();
  const { savedJobs, toggleSavedJob } = useAppData();
  const [applyJob, setApplyJob] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Saved Jobs</h1>
        <p className="text-slate-500 mt-1">Jobs you've bookmarked to apply for later.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {savedJobs.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-slate-700 font-semibold">No saved jobs</p>
            <p className="text-slate-500 text-sm mt-1">Use “Save Job” to bookmark jobs for later.</p>
          </div>
        ) : null}
        {savedJobs.map((job) => (
          <div key={job.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white p-2 flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
                <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3 h-3" /> Saved</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="flex-1 md:flex-none btn-primary"
                onClick={() => {
                  if (!isAuthenticated) return (window.location.href = '/login');
                  if (userRole !== 'jobseeker') return;
                  setApplyJob(job);
                }}
              >
                Apply Now
              </button>
              <button
                type="button"
                className="p-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
                onClick={() => toggleSavedJob(job)}
                aria-label="Unsave job"
              >
                <Bookmark className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ApplyJobModal open={!!applyJob} job={applyJob} onClose={() => setApplyJob(null)} />
    </div>
  );
};

export default SavedJobs;
