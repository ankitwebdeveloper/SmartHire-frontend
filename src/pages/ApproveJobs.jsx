import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Briefcase, CheckCircle2, XCircle,
  RefreshCw, Inbox, ChevronRight, DollarSign,
  Clock, Calendar, X
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ─── Full Job Detail Centered Modal ────────────────────────────────────────
const JobDetailPanel = ({ job, onClose, onApprove, onDeny, actionLoading }) => {
  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Centered modal wrapper — pointer-events-none so backdrop click still works */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
            <h3 className="text-base font-bold text-slate-800">Job Review</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Company Header */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl border border-slate-100 flex items-center justify-center p-2.5 bg-slate-50 shrink-0">
                <img
                  src={
                    job.companyLogo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'C')}&background=EFF6FF&color=3B82F6`
                  }
                  alt={job.companyName}
                  className="w-full h-full object-contain"
                  onError={e => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'C')}&background=EFF6FF&color=3B82F6`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{job.jobTitle}</h2>
                <p className="text-primary font-semibold text-lg">{job.companyName}</p>
                <span className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  ⏳ Pending Review
                </span>
              </div>
            </div>

            {/* Meta Chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MapPin, label: 'Location', value: job.location },
                { icon: DollarSign, label: 'Salary', value: job.salaryRange || 'Not specified' },
                { icon: Briefcase, label: 'Job Type', value: job.jobType },
                { icon: Clock, label: 'Experience', value: job.experienceLevel || 'Any' },
                { icon: Calendar, label: 'Submitted', value: new Date(job.createdAt).toLocaleDateString() },
              ]
                .filter(i => i.value)
                .map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 capitalize">{value}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Description */}
            {job.jobDescription && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">About the Role</h3>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{job.jobDescription}</p>
              </div>
            )}

            {/* Skills */}
            {(job.requiredSkills?.length > 0 || job.requirements?.length > 0) && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills || job.requirements || []).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Responsibilities</h3>
                <ul className="space-y-1.5">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-full"
                    >
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 px-8 py-5 border-t border-slate-100 bg-white flex gap-3">
            <button
              onClick={() => onDeny(job)}
              disabled={!!actionLoading[job._id]}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {actionLoading[job._id] === 'deny' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Deny
            </button>
            <button
              onClick={() => onApprove(job)}
              disabled={!!actionLoading[job._id]}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {actionLoading[job._id] === 'approve' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Approve
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Pending Job Card ───────────────────────────────────────────────────────
const PendingJobCard = ({ job, onApprove, onDeny, onCardClick, actionLoading }) => {
  const busy = actionLoading[job._id];

  return (
    <div
      className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onCardClick(job)}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 w-full pointer-events-none">
        {/* Logo */}
        <div className="shrink-0 w-16 h-16 sm:w-14 sm:h-14 rounded-xl border border-slate-100 flex items-center justify-center p-2 bg-slate-50">
          <img
            src={
              job.companyLogo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'C')}&background=EFF6FF&color=3B82F6`
            }
            alt={job.companyName}
            className="w-full h-full object-contain mix-blend-multiply"
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'C')}&background=EFF6FF&color=3B82F6`;
            }}
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
              {job.jobTitle}
            </h3>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              Pending
            </span>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">
              {job.jobType}
            </span>
          </div>
          <p className="text-slate-500 font-medium mb-3">{job.companyName}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </div>
            )}
            {job.location && <div className="w-1 h-1 rounded-full bg-slate-300" />}
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              {job.category || job.jobType}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-4 h-4" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: salary + actions */}
      <div
        className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto gap-4 md:gap-3 mt-4 md:mt-0"
        onClick={e => e.stopPropagation()}
      >
        {job.salaryRange && (
          <p className="text-base font-bold text-slate-900">{job.salaryRange}</p>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onDeny(job)}
            disabled={!!busy}
            className="flex items-center gap-2 py-2 px-4 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {busy === 'deny' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Deny
          </button>
          <button
            onClick={() => onApprove(job)}
            disabled={!!busy}
            className="flex items-center gap-2 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {busy === 'approve' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Approve
          </button>
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 pl-1">
            Details <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const ApproveJobs = () => {
  const [jobs, setJobs]                     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [actionLoading, setActionLoading]   = useState({});
  const [selectedJob, setSelectedJob]       = useState(null);

  const fetchPendingJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/jobs/pending');
      if (res.data?.success) setJobs(res.data.data);
    } catch {
      toast.error('Failed to load pending jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPendingJobs(); }, [fetchPendingJobs]);

  const handleApprove = async (job) => {
    try {
      setActionLoading(prev => ({ ...prev, [job._id]: 'approve' }));
      await API.patch(`/admin/jobs/${job._id}/approve`);
      toast.success(`"${job.jobTitle}" approved and is now live!`);
      setJobs(prev => prev.filter(j => j._id !== job._id));
      if (selectedJob?._id === job._id) setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve job');
    } finally {
      setActionLoading(prev => ({ ...prev, [job._id]: null }));
    }
  };

  const handleDeny = async (job) => {
    try {
      setActionLoading(prev => ({ ...prev, [job._id]: 'deny' }));
      await API.patch(`/admin/jobs/${job._id}/reject`);
      toast.success(`"${job.jobTitle}" has been denied.`);
      setJobs(prev => prev.filter(j => j._id !== job._id));
      if (selectedJob?._id === job._id) setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject job');
    } finally {
      setActionLoading(prev => ({ ...prev, [job._id]: null }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approve Jobs</h1>
          <p className="text-slate-500 mt-0.5">
            <span className="font-semibold text-slate-700">{jobs.length}</span>{' '}
            job{jobs.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
        <button
          onClick={fetchPendingJobs}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card flex flex-col items-center py-20 text-slate-400">
          <Inbox className="w-12 h-12 mb-4" />
          <p className="text-lg font-semibold">All caught up!</p>
          <p className="text-sm mt-1">No jobs are currently pending review.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map(job => (
            <PendingJobCard
              key={job._id}
              job={job}
              onApprove={handleApprove}
              onDeny={handleDeny}
              onCardClick={setSelectedJob}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApprove={handleApprove}
          onDeny={handleDeny}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default ApproveJobs;
