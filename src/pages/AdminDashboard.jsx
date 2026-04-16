import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Building2, Clock,
  ShieldCheck, RefreshCw, Plus, List, Trash2
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ─── Relative time helper ────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return 'just now';
  if (mins  < 60)  return `${mins} min${mins > 1 ? 's' : ''} ago`;
  if (hours < 24)  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// ─── Role label helper ───────────────────────────────────────────────────────
const roleLabel = (role) => {
  if (role === 'employer')               return 'Employer';
  if (role === 'jobseeker' || role === 'user') return 'Job Seeker';
  if (role === 'admin')                  return 'Admin';
  return role;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/jobs'),
      ]);
      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (jobsRes.data?.success) setJobs(jobsRes.data.data || []);
    } catch {
      // silently fail — show zeros
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleDelete = async (job) => {
    if (!job?._id) return;
    const ok = window.confirm('Are you sure you want to delete this job?');
    if (!ok) return;

    try {
      setDeletingId(job._id);
      await API.delete(`/admin/jobs/${job._id}`);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? '—',
      icon: Users,
      color: 'border-l-blue-500',
      iconColor: 'text-primary',
    },
    {
      label: 'Active Jobs',
      value: stats?.activeJobs ?? '—',
      icon: Briefcase,
      color: 'border-l-green-500',
      iconColor: 'text-green-500',
    },
    {
      label: 'Employers',
      value: stats?.companies ?? '—',
      icon: Building2,
      color: 'border-l-purple-500',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Pending Review',
      value: stats?.pendingJobs ?? '—',
      icon: Clock,
      color: 'border-l-orange-500',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage users, jobs, and platform settings.</p>
        </div>
        <button
          onClick={fetchStats}
          className="btn-primary flex items-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          Refresh Stats
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className={`card p-6 border-l-4 ${color}`}>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <div className="flex items-center justify-between mt-2">
              {loading ? (
                <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
              ) : (
                <h3 className="text-3xl font-bold text-slate-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
              )}
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Registrations — real data */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">New Registrations</h3>
            <button
              onClick={() => navigate('/admin/manage-users')}
              className="text-sm font-semibold text-primary hover:text-primary transition-colors"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
            </div>
          ) : stats?.recentUsers?.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No users yet.</p>
          ) : (
            <div className="space-y-3">
              {(stats?.recentUsers || []).map((user) => {
                const avatarSrc = user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=EFF6FF&color=3B82F6&bold=true`;
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 hover:bg-primary rounded-xl transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarSrc}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-100"
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=EFF6FF&color=3B82F6&bold=true`;
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{roleLabel(user.role)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-4">
                      {timeAgo(user.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/approve-jobs')}
              className="p-4 border border-slate-200 rounded-xl hover:bg-primary hover:border-primary transition-all text-left group"
            >
              <Clock className="w-6 h-6 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
              <h4 className="font-semibold text-slate-900 text-sm">Approve Jobs</h4>
              <p className="text-xs text-slate-500 mt-1">
                {stats?.pendingJobs ? `${stats.pendingJobs} pending` : 'Review pending jobs'}
              </p>
            </button>
            <button
              onClick={() => navigate('/admin/manage-users')}
              className="p-4 border border-slate-200 rounded-xl hover:bg-primary hover:border-primary transition-all text-left group"
            >
              <Users className="w-6 h-6 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
              <h4 className="font-semibold text-slate-900 text-sm">Manage Users</h4>
              <p className="text-xs text-slate-500 mt-1">Block, delete or reset passwords</p>
            </button>

            <button
              onClick={() => navigate('/admin/post-job')}
              className="p-4 border border-slate-200 rounded-xl hover:bg-primary hover:border-primary transition-all text-left group"
            >
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
              <h4 className="font-semibold text-slate-900 text-sm">Post Job</h4>
              <p className="text-xs text-slate-500 mt-1">Direct publish (no payment)</p>
            </button>

            <button
              onClick={() => navigate('/admin/jobs')}
              className="p-4 border border-slate-200 rounded-xl hover:bg-primary hover:border-primary transition-all text-left group"
            >
              <List className="w-6 h-6 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
              <h4 className="font-semibold text-slate-900 text-sm">Job List</h4>
              <p className="text-xs text-slate-500 mt-1">View approved jobs</p>
            </button>
            <button
              onClick={() => navigate('/admin/payments')}
              className="p-4 border border-slate-200 rounded-xl hover:bg-primary hover:border-primary transition-all text-left group"
            >
              <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
              <h4 className="font-semibold text-slate-900 text-sm">Payments</h4>
              <p className="text-xs text-slate-500 mt-1">View subscription transactions</p>
            </button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Jobs</h4>
            {loading ? (
              <p className="text-xs text-slate-500">Loading...</p>
            ) : jobs.length === 0 ? (
              <p className="text-xs text-slate-500">No jobs found</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {jobs.slice(0, 8).map((job) => (
                  <div key={job._id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-100">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{job.jobTitle}</p>
                      <p className="text-xs text-slate-500 truncate">{job.companyName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(job)}
                      disabled={deletingId === job._id}
                      className="px-2.5 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
