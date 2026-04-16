import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

const ProgressBar = ({ currentStep }) => {
  const steps = [1, 2, 3];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        {steps.map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-semibold ${
                  s <= currentStep ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {s}
              </div>
              <div className={`text-sm font-semibold ${s <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                {s === 1 ? 'Details' : s === 2 ? 'Requirements' : 'Preview'}
              </div>
            </div>
            {s !== 3 && (
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${s < currentStep ? 'w-full bg-primary' : s === currentStep ? 'w-1/2 bg-primary' : 'w-0 bg-primary'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const fieldError = (errors, key) => (errors?.[key] ? <p className="text-sm text-red-600 mt-1">{errors[key]}</p> : null);

export default function AdminPostJob() {
  const navigate = useNavigate();

  const categories = useMemo(() => ['IT', 'Marketing', 'Finance', 'Design', 'Engineering', 'Other'], []);
  const jobTypes = useMemo(
    () => ['full-time', 'part-time', 'internship', 'contract', 'remote'],
    [],
  );
  const experienceOptions = useMemo(
    () => ['fresher', '1-3 years', '3-5 years', '5+ years'],
    [],
  );

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    category: 'IT',
    jobDescription: '',
    skillsRequired: '',

    experienceRequired: 'fresher',
    education: '',
    openings: 1,
    gender: '',
    ageLimit: '',
  });

  const validateStep = (targetStep) => {
    const nextErrors = {};

    if (targetStep === 1) {
      if (!form.jobTitle.trim()) nextErrors.jobTitle = 'Job Title is required';
      if (!form.companyName.trim()) nextErrors.companyName = 'Company Name is required';
      if (!form.location.trim()) nextErrors.location = 'Location is required';
      if (!String(form.salary).trim()) nextErrors.salary = 'Salary is required';
      if (!form.jobType) nextErrors.jobType = 'Job Type is required';
      if (!form.category) nextErrors.category = 'Category is required';
      if (!form.jobDescription.trim() || form.jobDescription.trim().length < 20) {
        nextErrors.jobDescription = 'Job Description must be at least 20 characters';
      }
      if (!form.skillsRequired.trim()) nextErrors.skillsRequired = 'Skills Required is required';
    }

    if (targetStep === 2) {
      if (!form.experienceRequired) nextErrors.experienceRequired = 'Experience Required is required';
      if (!form.education.trim()) nextErrors.education = 'Education is required';
      if (!Number.isInteger(Number(form.openings)) || Number(form.openings) < 1) {
        nextErrors.openings = 'Openings must be at least 1';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onNext = () => {
    if (step === 1) {
      if (!validateStep(1)) return;
      setStep(2);
      setErrors({});
    } else if (step === 2) {
      if (!validateStep(2)) return;
      setStep(3);
      setErrors({});
    }
  };

  const onBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const skillsList = useMemo(() => {
    return String(form.skillsRequired || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [form.skillsRequired]);

  const publish = async () => {
    if (step !== 3) return;
    setSubmitting(true);
    try {
      const payload = {
        jobTitle: form.jobTitle,
        companyName: form.companyName,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        category: form.category,
        jobDescription: form.jobDescription,
        skillsRequired: form.skillsRequired,

        experienceRequired: form.experienceRequired,
        education: form.education,
        openings: Number(form.openings),
        gender: form.gender || '',
        ageLimit: form.ageLimit || '',
      };

      const res = await API.post('/admin/jobs', payload);
      console.log(res.data);
      toast.success('Job posted successfully');
      navigate('/admin/jobs');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job';
      toast.error(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Post Job (Admin)</h1>
        <p className="text-slate-500 mt-1">3-step job creation with preview and direct publish.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <ProgressBar currentStep={step} />

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                <input
                  className="input-field"
                  value={form.jobTitle}
                  onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
                />
                {fieldError(errors, 'jobTitle')}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                <input
                  className="input-field"
                  value={form.companyName}
                  onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                />
                {fieldError(errors, 'companyName')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  className="input-field"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                />
                {fieldError(errors, 'location')}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Salary</label>
                <input
                  className="input-field"
                  placeholder="e.g. 60000 - 90000"
                  value={form.salary}
                  onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                />
                {fieldError(errors, 'salary')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                <select className="input-field" value={form.jobType} onChange={(e) => setForm((p) => ({ ...p, jobType: e.target.value }))}>
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {fieldError(errors, 'jobType')}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select className="input-field" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {fieldError(errors, 'category')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Skills Required</label>
              <input
                className="input-field"
                placeholder="Comma separated, e.g. React, Node, SQL"
                value={form.skillsRequired}
                onChange={(e) => setForm((p) => ({ ...p, skillsRequired: e.target.value }))}
              />
              {fieldError(errors, 'skillsRequired')}
              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillsList.map((s) => (
                    <span key={s} className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
              <textarea
                rows="6"
                className="input-field resize-y"
                value={form.jobDescription}
                onChange={(e) => setForm((p) => ({ ...p, jobDescription: e.target.value }))}
              />
              {fieldError(errors, 'jobDescription')}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Required</label>
                <select
                  className="input-field"
                  value={form.experienceRequired}
                  onChange={(e) => setForm((p) => ({ ...p, experienceRequired: e.target.value }))}
                >
                  {experienceOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {fieldError(errors, 'experienceRequired')}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Education</label>
                <input
                  className="input-field"
                  placeholder="e.g. B.Tech / M.Tech"
                  value={form.education}
                  onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))}
                />
                {fieldError(errors, 'education')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Openings</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.openings}
                  onChange={(e) => setForm((p) => ({ ...p, openings: e.target.value }))}
                  min={1}
                />
                {fieldError(errors, 'openings')}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gender (optional)</label>
                <input
                  className="input-field"
                  placeholder="e.g. Any / Male / Female"
                  value={form.gender}
                  onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Age Limit (optional)</label>
              <input
                className="input-field"
                placeholder="e.g. 18-30"
                value={form.ageLimit}
                onChange={(e) => setForm((p) => ({ ...p, ageLimit: e.target.value }))}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{form.jobTitle || 'Job Title'}</h2>
                <p className="text-primary font-semibold mt-1">{form.companyName || 'Company'}</p>
              </div>
              <div className="text-sm font-semibold px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                Will be posted as <span className="uppercase">{'approved'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4 bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Location</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.location || '—'}</p>
              </div>
              <div className="card p-4 bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Salary</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.salary || '—'}</p>
              </div>
              <div className="card p-4 bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Job Type</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.jobType}</p>
              </div>
              <div className="card p-4 bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Category</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.category}</p>
              </div>
            </div>

            <div className="card p-5 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Job Description</h3>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{form.jobDescription}</p>
            </div>

            <div className="card p-5 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Skills Required</h3>
              {skillsList.length === 0 ? (
                <p className="text-slate-500 text-sm">—</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((s) => (
                    <span key={s} className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-5 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Experience Required</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.experienceRequired}</p>
              </div>
              <div className="card p-5 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Education</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.education || '—'}</p>
              </div>
              <div className="card p-5 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Openings</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{form.openings}</p>
              </div>
              <div className="card p-5 border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Gender / Age limit</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {(form.gender || '—') + ' / ' + (form.ageLimit || '—')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" className="btn-secondary" onClick={onBack} disabled={step === 1}>
            Back
          </button>

          {step < 3 ? (
            <button type="button" className="btn-primary" onClick={onNext}>
              Next
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={publish} disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

