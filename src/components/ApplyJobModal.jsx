import React, { useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useAppData } from '../context/AppDataContext';
import { formatBytes, isAllowedResumeType, MAX_UPLOAD_BYTES_2MB, readFileAsDataUrl } from '../utils/file';

const ApplyJobModal = ({ open, job, onClose }) => {
  const { addApplication, candidateResume } = useAppData();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveJob = job || null;

  const resumeToUse = useMemo(() => resume || candidateResume || null, [resume, candidateResume]);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setResume(null);
    setError('');
    setSuccess('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const pickResume = () => {
    setError('');
    fileInputRef.current?.click();
  };

  const handleResumeSelected = async (file) => {
    if (!file) return;
    setError('');
    if (!isAllowedResumeType(file)) {
      setError('Invalid file format. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES_2MB) {
      setError('File is too large. Max allowed size is 2MB.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setResume({
        name: file.name,
        type: file.type || '',
        size: file.size,
        dataUrl,
      });
    } catch {
      setError('Unable to read this file. Please try again.');
    }
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
    if (!resumeToUse) {
      setError('Please upload a resume to apply.');
      return;
    }

    setIsSubmitting(true);
    try {
      addApplication({
        job: effectiveJob,
        applicant: { fullName, email, phone, coverLetter },
        resume: resumeToUse,
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
        <div className="mb-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Upload</label>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleResumeSelected(e.target.files?.[0] || null)}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button type="button" className="btn-secondary py-2.5" onClick={pickResume}>
              {resumeToUse ? 'Replace Resume' : 'Upload Resume'}
            </button>
            {resumeToUse ? (
              <div className="flex-1 p-3 rounded-xl border border-slate-100 bg-white">
                <p className="text-sm font-semibold text-slate-900">{resumeToUse.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatBytes(resumeToUse.size)}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">PDF, DOC, DOCX up to 2MB</p>
            )}
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

