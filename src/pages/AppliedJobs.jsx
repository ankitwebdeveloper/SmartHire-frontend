import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import StepTracker from '../components/StepTracker';

const AppliedJobs = () => {
  const { applications } = useAppData();
  const [openId, setOpenId] = useState(null);

  const steps = useMemo(
    () => ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'],
    [],
  );

  const rows = applications;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applied Jobs</h1>
        <p className="text-slate-500 mt-1">Track the status of all your job applications.</p>
      </div>

      <div className="card p-6">
        {rows.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-slate-700 font-semibold">No applications yet</p>
            <p className="text-slate-500 text-sm mt-1">Apply to a job to see it appear here.</p>
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm">
                <th className="pb-4 font-medium pl-4">Job Role</th>
                <th className="pb-4 font-medium">Company</th>
                <th className="pb-4 font-medium">Date Applied</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((app) => {
                const statusIndex = Math.max(0, Math.min(app.statusStepIndex ?? 0, steps.length - 1));
                const statusLabel = steps[statusIndex];
                const statusColor =
                  statusIndex >= 4
                    ? 'text-green-600 bg-green-50 border-green-100'
                    : statusIndex >= 3
                      ? 'text-orange-600 bg-orange-50 border-orange-100'
                      : statusIndex >= 1
                        ? 'text-blue-600 bg-blue-50 border-blue-100'
                        : 'text-slate-600 bg-slate-50 border-slate-200';
                const isOpen = openId === app.id;

                return (
                  <React.Fragment key={app.id}>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-medium text-slate-900 pl-4">{app.job?.title}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {app.job?.logo ? (
                            <img
                              src={app.job.logo}
                              alt={app.job.company}
                              className="w-8 h-8 rounded-md border border-slate-100 p-0.5 bg-white object-contain"
                            />
                          ) : null}
                          <span className="text-slate-600">{app.job?.company}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500">{app.dateAppliedLabel}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors inline-block"
                          onClick={() => setOpenId((prev) => (prev === app.id ? null : app.id))}
                          aria-label="View application status"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-b border-slate-50">
                        <td className="py-5 px-4" colSpan={5}>
                          <div className="rounded-2xl border border-slate-100 bg-white p-5">
                            <p className="text-sm font-semibold text-slate-900 mb-4">
                              Application progress
                            </p>
                            <StepTracker steps={steps} currentIndex={statusIndex} />
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
