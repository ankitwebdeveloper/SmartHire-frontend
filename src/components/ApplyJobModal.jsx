import React, { useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useAppData } from '../context/AppDataContext';


const ApplyJobModal = ({ open, job, onClose }) => {
  const { addApplication } = useAppData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveJob = job || null;



  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');

    setError('');
    setSuccess('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };



  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!effectiveJob) return;
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in Full Name and Email.');
      return;
    }


    setIsSubmitting(true);
    try {
      addApplication({
        job: effectiveJob,
        applicant: { fullName, email, phone, coverLetter }
      });
      setSuccess('Application submitted successfully.');
      setTimeout(() => {
        handleClose();
      }, 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={effectiveJob ? `Apply: ${effectiveJob.title}` : 'Apply'}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="apply-job-form"
            className="btn-primary"
            disabled={isSubmitting || !effectiveJob}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      }
    >
      {effectiveJob ? (
        <div className="mb-4 p-4 rounded-xl border border-slate-100 bg-primary">
          <p className="text-sm font-semibold text-slate-900">{effectiveJob.company}</p>
          <p className="text-xs text-slate-500 mt-1">{effectiveJob.location}</p>
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 font-semibold text-sm">
          {success}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm">
          {error}
        </div>
      ) : null}

      <form id="apply-job-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
          <input className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
            <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>



        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter</label>
          <textarea
            className="input-field h-28 py-3"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;

