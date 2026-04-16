import React, { useEffect, useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await API.get('/admin/jobs');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (job) => {
    if (!job?._id) return;
    const ok = window.confirm('Are you sure you want to delete this job?');
    if (!ok) return;

    setDeletingId(job._id);
    try {
      await API.delete(`/admin/jobs/${job._id}`);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const statusLabel = (j) => j?.approvalStatus || j?.status || '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Jobs</h1>
          <p className="text-slate-500 mt-0.5">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} in system
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
        <div className="flex items-center justify-center py-24 text-slate-500">Loading...</div>
      ) : err ? (
        <div className="card p-10 text-center text-red-600 font-semibold">{err}</div>
      ) : jobs.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-slate-400">
          <p className="font-semibold">No jobs found</p>
          <p className="text-sm mt-1">Publish a job to see it here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Job Title</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Company Name</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Location</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Job Type</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Posted Date</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{job.jobTitle || '—'}</td>
                    <td className="px-6 py-4 text-slate-700">{job.companyName || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{job.location || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{job.jobType || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {statusLabel(job)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(job)}
                        disabled={deletingId === job._id}
                        className="p-2 rounded-lg border border-red-600 bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

