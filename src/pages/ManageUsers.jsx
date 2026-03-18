import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Shield, ShieldOff, Trash2, KeyRound,
  CheckCircle, XCircle, Eye, EyeOff, RefreshCw, AlertTriangle, Copy
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ─── Password Reset Modal ───────────────────────────────────────────────────
const ResetPasswordModal = ({ user, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (newPassword !== confirm) { toast.error("Passwords don't match"); return; }
    try {
      setLoading(true);
      await API.patch(`/admin/users/${user._id}/reset-password`, { newPassword });
      toast.success(`Password updated for ${user.name}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            <p className="text-sm text-slate-500">{user.name} · {user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-11"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteConfirmModal = ({ user, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Account</h3>
      <p className="text-sm text-slate-500 mb-1">
        You are about to permanently delete <strong className="text-slate-900">{user.name}</strong>'s account.
      </p>
      <p className="text-xs text-red-500 mb-6">This will remove their profile, applications, and saved jobs. This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Role Badge ─────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const styles = {
    admin:     'bg-purple-100 text-purple-700',
    employer:  'bg-blue-100 text-blue-700',
    jobseeker: 'bg-emerald-100 text-emerald-700',
    user:      'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[role] || 'bg-slate-100 text-slate-600'}`}>
      {role === 'jobseeker' || role === 'user' ? 'Job Seeker' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const ManageUsers = () => {
  const [users, setUsers]               = useState([]);
  const [totalUsers, setTotalUsers]     = useState(0);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Modal state
  const [resetTarget, setResetTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: 100 });
      if (roleFilter) params.set('role', roleFilter);
      const res = await API.get(`/admin/users?${params}`);
      if (res.data?.success) {
        setUsers(res.data.data);
        setTotalUsers(res.data.totalUsers);
      }
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Client-side search filter (fast UX)
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const handleBlock = async (user) => {
    const isBlocked = user.accountStatus === 'blocked';
    const action = isBlocked ? 'unblock' : 'block';
    try {
      setActionLoading(prev => ({ ...prev, [user._id]: 'block' }));
      await API.patch(`/admin/users/${user._id}/block`, { action });
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      setUsers(prev => prev.map(u =>
        u._id === user._id ? { ...u, accountStatus: isBlocked ? 'active' : 'blocked' } : u
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(prev => ({ ...prev, [user._id]: null }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await API.delete(`/admin/users/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name}'s account deleted`);
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      setTotalUsers(prev => prev - 1);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  // Generate a random strong password, reset it, and copy to clipboard
  const handleQuickCopy = async (user) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
    const generated = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    try {
      setActionLoading(prev => ({ ...prev, [user._id]: 'copy' }));
      await API.patch(`/admin/users/${user._id}/reset-password`, { newPassword: generated });
      await navigator.clipboard.writeText(generated);
      toast.success(
        `New password for ${user.name}: ${generated}\n(Copied to clipboard ✓)`,
        { duration: 6000 }
      );
    } catch (err) {
      // Clipboard may be blocked in some browsers — show the password anyway
      toast.success(`New password set: ${generated}`, { duration: 8000 });
    } finally {
      setActionLoading(prev => ({ ...prev, [user._id]: null }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-500 mt-0.5">
            <span className="font-semibold text-slate-700">{totalUsers}</span> registered users on SmartHire
          </p>
        </div>
        <button onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
          <option value="">All Roles</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* User Table */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[56px_1fr_1fr_1fr_130px_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Avatar</span>
          <span>Name</span>
          <span>Email</span>
          <span>Password</span>
          <span>Role / Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <Users className="w-10 h-10 mb-3" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => {
              const isBlocked  = user.accountStatus === 'blocked';
              const isAdmin    = user.role === 'admin';
              const blockBusy  = actionLoading[user._id] === 'block';
              const avatarSrc  = user.avatar
                ? user.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=EFF6FF&color=3B82F6&bold=true`;

              return (
                <div key={user._id}
                  className={`grid grid-cols-1 md:grid-cols-[56px_1fr_1fr_1fr_130px_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors ${isBlocked ? 'opacity-60' : ''}`}>

                  {/* Avatar */}
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=EFF6FF&color=3B82F6&bold=true`;
                    }}
                  />

                  {/* Name + status */}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                    {isBlocked ? (
                      <span className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <XCircle className="w-3 h-3" /> Blocked
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>

                  {/* Password — masked; click Copy to generate & copy a new one */}
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-slate-400 tracking-widest select-none">••••••••</code>
                    {!isAdmin && (
                      <button
                        onClick={() => handleQuickCopy(user)}
                        disabled={actionLoading[user._id] === 'copy'}
                        title="Generate new password & copy to clipboard"
                        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors text-xs font-medium disabled:opacity-50"
                      >
                        {actionLoading[user._id] === 'copy'
                          ? <RefreshCw className="w-3 h-3 animate-spin" />
                          : <Copy className="w-3 h-3" />}
                        Copy
                      </button>
                    )}
                  </div>

                  {/* Role */}
                  <RoleBadge role={user.role} />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    {!isAdmin && (
                      <>
                        {/* Reset Password */}
                        <button
                          onClick={() => setResetTarget(user)}
                          title="Reset password"
                          className="p-2 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors">
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Block / Unblock */}
                        <button
                          onClick={() => handleBlock(user)}
                          disabled={blockBusy}
                          title={isBlocked ? 'Unblock user' : 'Block user'}
                          className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                            isBlocked
                              ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                          }`}>
                          {blockBusy
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : isBlocked
                              ? <ShieldOff className="w-4 h-4" />
                              : <Shield className="w-4 h-4" />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(user)}
                          title="Delete account"
                          className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <span className="text-xs text-slate-400 italic px-2">Protected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {resetTarget && (
        <ResetPasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onSuccess={fetchUsers}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default ManageUsers;
