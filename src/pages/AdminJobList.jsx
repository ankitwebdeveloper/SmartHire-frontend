import React, { useEffect, useState } from 'react';
import { Briefcase, RefreshCw, Inbox } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await API.get('/admin/jobs?status=approved');
      console.log(res.data);
      setJobs(res.data?.data || []);
    } catch (e) {
      console.error(e);
      setErr('Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const salaryLabel = (job) => {
    if (job.salaryMin == null && job.salaryMax == null) return '—';
    if (job.salaryMin != null && job.salaryMax != null && job.salaryMin !== job.salaryMax) {
      return `${job.salaryMin} - ${job.salaryMax}`;
    }
    return String(job.salaryMin ?? job.salaryMax ?? '—');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Jobs</h1>
          <p className="text-slate-500 mt-0.5">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} approved/live
          </p>
        </div>

        <button
          type="button"
          onClick={fetchJobs}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-primary transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : err ? (
        <div className="card p-10 text-center text-red-600 font-semibold">{err}</div>
      ) : jobs.length === 0 ? (
        <div className="card flex flex-col items-center py-20 text-slate-400">
          <Inbox className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">No jobs posted yet</p>
          <p className="text-sm mt-1">Publish a job to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.jobTitle}</h3>
                  <p className="text-primary font-semibold mt-1">{job.companyName}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{job.jobType}</span>
                    </div>
                    <div>{job.location || '—'}</div>
                    <div className="text-slate-500">Category: {job.category || '—'}</div>
                    <div className="text-slate-500">Salary: {salaryLabel(job)}</div>
                  </div>
                </div>
                <div className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                  {job.approvalStatus || job.status || 'approved'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

