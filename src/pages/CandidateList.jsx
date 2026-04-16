import React, { useMemo, useState, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import StepTracker from '../components/StepTracker';
import API from '../utils/api';
import toast from 'react-hot-toast';

const CandidateList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [viewApp, setViewApp] = useState(null);

  const steps = useMemo(
    () => ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    [],
  );

  const statusToIndex = (status) => {
    switch (status) {
      case 'applied':
        return 0;
      case 'shortlisted':
        return 1;
      case 'interview':
        return 2;
      case 'selected':
        return 3;
      case 'rejected':
        return 4;
      case 'under_review':
        return 1;
      default:
        return 0;
    }
  };

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await API.get('/applications/employer');
      console.log(res.data);
      setApplications(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadResume = (app) => {
    const url = app?.resumeUrl;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const updateStatus = async (appId, status) => {
    try {
      const res = await API.patch(`/applications/${appId}/status`, { status });
      console.log(res.data);
      toast.success(res.data?.message || 'Status updated');
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
      if (viewApp?._id === appId) setViewApp((p) => ({ ...p, status }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Candidate List</h1>
        <p className="text-slate-500 mt-1">Review applicants for your active job postings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="card p-10 text-center md:col-span-2 lg:col-span-3">
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : loadError ? (
          <div className="card p-10 text-center md:col-span-2 lg:col-span-3">
            <p className="text-red-600 font-semibold">{loadError}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-10 text-center md:col-span-2 lg:col-span-3">
            <p className="text-slate-700 font-semibold">No applicants yet</p>
            <p className="text-slate-500 text-sm mt-1">Applications submitted by candidates will appear here.</p>
          </div>
        ) : null}
        {applications.map((app) => {
          const name = app.candidateId?.name || 'Candidate';
          const email = app.candidateId?.email || '';
          const role = app.jobId?.jobTitle || '—';
          const statusIndex = Math.max(0, Math.min(statusToIndex(app.status), steps.length - 1));
          const statusLabel = steps[statusIndex];

          return (
          <div key={app._id} className="card p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                   {name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">{name}</h3>
                   <p className="text-xs text-slate-500">{email || '—'}</p>
                 </div>
               </div>
               <span className="text-xs font-semibold px-2 py-1 bg-primary text-slate-600 rounded-md">{statusLabel}</span>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                Applied for: <span className="font-semibold text-slate-900">{role}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => downloadResume(app)}
                disabled={!app.resumeUrl}
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 bg-primary hover:bg-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Resume
              </button>
              <button
                type="button"
                onClick={() => setViewApp(app)}
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" /> View Status
              </button>
            </div>
          </div>
        );
        })}
      </div>

      <Modal
        open={!!viewApp}
        title="Candidate Application Status"
        onClose={() => setViewApp(null)}
        footer={
          <div className="flex items-center justify-end">
            <button type="button" className="btn-primary" onClick={() => setViewApp(null)}>
              Close
            </button>
          </div>
        }
      >
        {viewApp ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-primary">
              <p className="text-sm font-semibold text-slate-900">{viewApp.candidateId?.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {viewApp.jobId?.jobTitle} • {viewApp.candidateId?.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Update Status</label>
              <select
                className="input-field"
                value={viewApp.status}
                onChange={(e) => updateStatus(viewApp._id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <StepTracker steps={steps} currentIndex={Math.max(0, Math.min(statusToIndex(viewApp.status), steps.length - 1))} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CandidateList;
