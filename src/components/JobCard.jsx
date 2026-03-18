import React, { useState } from 'react';
import { MapPin, Briefcase, Bookmark, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import ApplyJobModal from './ApplyJobModal';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { isJobSaved, toggleSavedJob } = useAppData();
  const [applyOpen, setApplyOpen] = useState(false);

  const handleApply = () => {
    if (!isAuthenticated) return navigate('/login');
    if (userRole === 'employer') return navigate(`/${userRole}/dashboard`);
    setApplyOpen(true);
  };

  const handleSave = () => {
    if (!isAuthenticated) return navigate('/login');
    toggleSavedJob(job);
  };

  const saved = isJobSaved(job.id);

  return (
    <>
      <div className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
      
      <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 w-full">
        {/* Logo */}
        <div className="shrink-0 w-16 h-16 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border border-slate-100 flex items-center justify-center p-2 bg-slate-50">
          <img src={job.logo} alt={job.company} className="w-full h-full object-contain mix-blend-multiply" />
        </div>
        
        {/* Details text */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {job.type}
            </span>
          </div>

          <p className="text-slate-500 font-medium mb-3">{job.company}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {job.location}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              {job.category}
            </div>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto gap-4 md:gap-3 mt-4 md:mt-0">
        <p className="text-lg font-bold text-slate-900">
          {job.salary}
        </p>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className={`btn-secondary py-2 px-3 sm:py-2.5 sm:px-4 flex items-center gap-2 ${saved ? 'border-primary/30 bg-primary/5 text-primary' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Unsave' : 'Save'}</span>
          </button>
          <button onClick={handleApply} className="btn-primary py-2 px-4 sm:py-2.5 sm:px-5 flex items-center gap-2">
            Apply
            <ChevronRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>
      </div>

    </div>
      <ApplyJobModal open={applyOpen} job={job} onClose={() => setApplyOpen(false)} />
    </>
  );
};

export default JobCard;
