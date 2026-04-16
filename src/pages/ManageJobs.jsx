import React, { useMemo, useState, useEffect } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet } from 'lucide-react';
import API from '../utils/api';

const ManageJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experience: '',
    description: '',
  });

  const statusMeta = useMemo(
    () => ({
      pending: 'text-orange-700 bg-orange-50 border-orange-100',
      approved: 'text-green-700 bg-green-50 border-green-100',
      rejected: 'text-red-700 bg-red-50 border-red-100',
      draft: 'text-blue-700 bg-blue-50 border-blue-100',
    }),
    [],
  );

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await API.get('/jobs/employer');
      console.log(res.data);
      setJobs(res.data?.data || []);
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

  const openAdd = () => {
    setDraft({
      title: '',
      company: '',
      location: '',
      salary: '',
      jobType: 'full-time',
      experience: '',
      description: '',
    });
    setAddOpen(true);
  };

  const openEdit = (job) => {
    setEditId(job._id);
    setDraft({
      title: job.jobTitle || '',
      company: job.companyName || '',
      location: job.location || '',
      salary: job.salaryMin != null && job.salaryMax != null ? `${job.salaryMin} - ${job.salaryMax}` : '',
      jobType: job.jobType || 'full-time',
      experience: job.experienceLevel || '',
      description: job.jobDescription || '',
    });
  };

  const closeEdit = () => {
    setEditId(null);
    setDraft({
      title: '',
      company: '',
      location: '',
      salary: '',
      jobType: 'full-time',
      experience: '',
      description: '',
    });
  };

  const submitAdd = (e) => {
    e.preventDefault();
    // Redirect to the actual Post Job page flow for creation (keeps contract identical)
    toast('Use "Post Job" to create a new job.');
    setAddOpen(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const res = await API.put(`/jobs/${editId}`, {
        title: draft.title,
        company: draft.company,
        location: draft.location,
        salary: draft.salary,
        jobType: draft.jobType,
        experience: draft.experience,
        description: draft.description,
      });
      console.log(res.data);
      toast.success(res.data?.message || 'Job updated');
      closeEdit();
      await load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update job');
    }
  };

  const removeJob = async (id) => {
    if (!id) return;
    try {
      const res = await API.delete(`/jobs/${id}`);
      console.log(res.data);
      toast.success(res.data?.message || 'Job deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const salaryLabel = (job) => {
    if (job.salaryMin == null && job.salaryMax == null) return '—';
    if (job.salaryMin != null && job.salaryMax != null && job.salaryMin !== job.salaryMax) return `${job.salaryMin} - ${job.salaryMax}`;
    return String(job.salaryMin ?? job.salaryMax);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
             Manage Jobs
             <span className="text-sm font-semibold flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
                <Wallet className="w-4 h-4" /> You have {user?.remainingJobCredits || 0} job posts remaining
             </span>
          </h1>
          <p className="text-slate-500 mt-1">View and manage your posted job listings.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn-secondary">
          Add Job
        </button>
      </div>

      <div className="card p-6">
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : loadError ? (
          <div className="py-8 text-center text-red-600">{loadError}</div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No jobs posted yet</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm">
                <th className="pb-4 font-medium pl-4">Job Title</th>
                <th className="pb-4 font-medium">Location</th>
                <th className="pb-4 font-medium">Salary</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {jobs.map((job) => {
                const status = job.status || job.approvalStatus || 'pending';
                const statusColor = statusMeta[status] || statusMeta.pending;
                return (
                  <tr key={job._id} className="border-b border-slate-50 last:border-0 hover:bg-primary/50 transition-colors">
                    <td className="py-4 font-medium text-slate-900 pl-4">{job.jobTitle}</td>
                    <td className="py-4 text-slate-600">{job.location || '—'}</td>
                    <td className="py-4 text-slate-600">{salaryLabel(job)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {status === 'draft' ? (
                           <button
                             type="button"
                             onClick={() => navigate('/employer/post-job', { state: { resumeDraft: true } })}
                             className="btn-primary py-2 px-3 text-sm flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-none"
                           >
                             Complete Payment
                           </button>
                        ) : (
                           <button
                             type="button"
                             onClick={() => openEdit(job)}
                             className="btn-secondary py-2 px-3 text-sm flex items-center gap-2"
                           >
                             <Pencil className="w-4 h-4" /> Edit
                           </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeJob(job._id)}
                          className="btn-secondary py-2 px-3 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <Modal
        open={addOpen}
        title="Add Job"
        onClose={() => setAddOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-job-form" className="btn-primary">
              Add Job
            </button>
          </div>
        }
      >
        <form id="add-job-form" onSubmit={submitAdd} className="space-y-4">
          <div>
            <p className="text-sm text-slate-600">
              Please use the <span className="font-semibold">Post Job</span> page to create a new job (it submits with
              <span className="font-semibold"> pending</span> status for admin approval).
            </p>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editId}
        title="Edit Job"
        onClose={closeEdit}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={closeEdit}>
              Cancel
            </button>
            <button type="submit" form="edit-job-form" className="btn-primary">
              Save Changes
            </button>
          </div>
        }
      >
        <form id="edit-job-form" onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
            <input className="input-field" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            <input className="input-field" value={draft.company} onChange={(e) => setDraft((p) => ({ ...p, company: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input className="input-field" value={draft.location} onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Salary</label>
              <input className="input-field" value={draft.salary} onChange={(e) => setDraft((p) => ({ ...p, salary: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
              <select className="input-field" value={draft.jobType} onChange={(e) => setDraft((p) => ({ ...p, jobType: e.target.value }))}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience</label>
              <input className="input-field" value={draft.experience} onChange={(e) => setDraft((p) => ({ ...p, experience: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea rows="5" className="input-field resize-y" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageJobs;
