import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, RefreshCw, CreditCard, CheckCircle, XCircle,
  Clock, DollarSign, Calendar, Inbox
} from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ─── Status Badge ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    completed: { cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle,  label: 'Completed' },
    pending:   { cls: 'bg-amber-100  text-amber-700',   icon: Clock,         label: 'Pending'   },
    failed:    { cls: 'bg-red-100    text-red-700',     icon: XCircle,       label: 'Failed'    },
    refunded:  { cls: 'bg-slate-100  text-slate-600',   icon: CreditCard,    label: 'Refunded'  },
  };
  const { cls, icon: Icon, label } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const AdminPayments = () => {
  const [payments, setPayments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/payments?limit=100');
      if (res.data?.success) {
        setPayments(res.data.data);
        setTotalPayments(res.data.totalPayments);
      }
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.employerId?.name?.toLowerCase().includes(q) ||
      p.employerId?.email?.toLowerCase().includes(q) ||
      p.transactionId?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || p.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingCount  = payments.filter(p => p.paymentStatus === 'pending').length;
  const failedCount   = payments.filter(p => p.paymentStatus === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-500 mt-0.5">
            <span className="font-semibold text-slate-700">{totalPayments}</span> total transactions
          </p>
        </div>
        <button onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Revenue</p>
            <p className="text-xl font-bold text-slate-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Pending</p>
            <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Failed</p>
            <p className="text-xl font-bold text-slate-900">{failedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or transaction ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[56px_1fr_1fr_120px_110px_120px_110px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Avatar</span>
          <span>Employer</span>
          <span>Email</span>
          <span>Gateway</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <Inbox className="w-10 h-10 mb-3" />
            <p className="font-medium">No payments found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(payment => {
              const employer = payment.employerId;
              const name   = employer?.name  || 'Unknown Employer';
              const email  = employer?.email || '—';
              const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EFF6FF&color=3B82F6&bold=true`;

              return (
                <div key={payment._id}
                  className="grid grid-cols-1 md:grid-cols-[56px_1fr_1fr_120px_110px_120px_110px] gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors">

                  {/* Avatar */}
                  <img
                    src={avatarSrc}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                  />

                  {/* Name */}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{name}</p>
                    <p className="text-xs text-slate-400 font-mono truncate mt-0.5" title={payment.transactionId}>
                      ID: {payment.transactionId ? `${payment.transactionId.slice(0, 16)}…` : '—'}
                    </p>
                  </div>

                  {/* Email */}
                  <p className="text-sm text-slate-500 truncate">{email}</p>

                  {/* Gateway */}
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full w-fit">
                    {payment.paymentGateway || 'Razorpay'}
                  </span>

                  {/* Amount */}
                  <p className="text-sm font-bold text-slate-900">
                    ₹{payment.amount?.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-400 font-normal ml-1">{payment.currency}</span>
                  </p>

                  {/* Status */}
                  <StatusBadge status={payment.paymentStatus} />

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
