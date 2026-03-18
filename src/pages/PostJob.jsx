import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../utils/api';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experience: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        experience: form.experience,
        description: form.description,
      };

      const res = await API.post('/jobs', payload);
      console.log(res.data);

      toast.success(res.data?.message || 'Job submitted for admin approval');

      setForm({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experience: '',
        description: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to create a new job listing.</p>
      </div>

      <div className="card p-8">
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Product Designer"
              className="input-field"
              value={form.title}
              onChange={onChange('title')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            <input
              type="text"
              placeholder="e.g. SmartHire"
              className="input-field"
              value={form.company}
              onChange={onChange('company')}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g. New York, NY (or Remote)"
                className="input-field"
                value={form.location}
                onChange={onChange('location')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
              <input
                type="text"
                placeholder="e.g. 100000 - 120000"
                className="input-field"
                value={form.salary}
                onChange={onChange('salary')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
              <select className="input-field" value={form.jobType} onChange={onChange('jobType')}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience</label>
              <input
                type="text"
                placeholder="e.g. 1-3 years"
                className="input-field"
                value={form.experience}
                onChange={onChange('experience')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
            <textarea
              rows="6"
              placeholder="Describe the role and responsibilities..."
              className="input-field resize-y"
              value={form.description}
              onChange={onChange('description')}
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
