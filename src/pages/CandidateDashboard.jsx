import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, CheckCircle, Bell, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import JobCard from '../components/JobCard';
import API from '../utils/api';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
    <div className={`p-4 rounded-xl mb-4 ${colorClass}`}>
      {React.createElement(icon, { className: 'w-8 h-8' })}
    </div>
    <div className="flex flex-col items-center">
      <p className="text-slate-800 font-semibold mb-1">{title}</p>
      <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { applications, savedJobs, candidateResume } = useAppData();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get('/profiles/me').then(res => setProfile(res.data?.profile)).catch(() => {});
  }, []);

  // Basic derived stats
  const interviewsCount = applications.filter(a => a.statusStepIndex === 3).length;

  // Dynamic Profile Completion
  const hasBasic = !!(user?.name && user?.email);
  const hasResume = !!candidateResume;
  const hasEdu = !!(profile?.education?.length > 0);
  const hasPortfolio = !!(profile?.socialLinks?.portfolio || profile?.socialLinks?.linkedin || profile?.skills?.length > 0);

  const completedCount = [hasBasic, hasResume, hasEdu, hasPortfolio].filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      {/* Centered Welcome */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Welcome back, {user?.name || 'User'}</h1>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Applied Jobs" value={applications.length || 0} icon={FileText} colorClass="bg-primary text-primary" />
        <StatCard title="Saved Jobs" value={savedJobs.length || 0} icon={Bookmark} colorClass="bg-yellow-50 text-yellow-600" />
        <StatCard title="Interviews" value={interviewsCount} icon={CheckCircle} colorClass="bg-red-50 text-red-600" />
      </div>

      {/* Profile Completion Aesthetics Override */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mt-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Profile Setup</h3>
          <span className="text-3xl font-extrabold text-primary">{completionPercentage}%</span>
        </div>
        
        <div className="w-full bg-primary rounded-full h-2 overflow-hidden mb-8">
          <div 
            className="bg-primary h-full transition-all duration-1000 ease-out rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${hasBasic ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-primary border-slate-200 text-slate-500'} flex items-start gap-3 transition-colors`}>
             <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <p className="font-semibold text-sm">Basic Info</p>
               <p className="text-xs mt-0.5 opacity-80">Name, Email, Verified</p>
             </div>
          </div>
          <div className={`p-4 rounded-xl border ${hasResume ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-primary border-slate-200 text-slate-500'} flex items-start gap-3 transition-colors`}>
             <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <p className="font-semibold text-sm">Resume</p>
               <p className="text-xs mt-0.5 opacity-80">Upload your CV</p>
             </div>
          </div>
          <div className={`p-4 rounded-xl border ${hasEdu ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-primary border-slate-200 text-slate-500'} flex items-start gap-3 transition-colors`}>
             <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <p className="font-semibold text-sm">Education</p>
               <p className="text-xs mt-0.5 opacity-80">Degrees & Certs</p>
             </div>
          </div>
          <div className={`p-4 rounded-xl border ${hasPortfolio ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-primary border-slate-200 text-slate-500'} flex items-start gap-3 transition-colors`}>
             <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
             <div>
               <p className="font-semibold text-sm">Skills Base</p>
               <p className="text-xs mt-0.5 opacity-80">Tags & Portfolios</p>
             </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link to="/profile" className="btn-primary py-2.5 px-6 rounded-xl font-semibold shadow-sm text-sm">
            {completionPercentage === 100 ? 'Update Profile' : 'Complete Your Profile'}
          </Link>
        </div>
      </div>

      {/* Table Format Applications */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-primary">
                <th className="py-4 px-6 font-bold text-slate-900 w-24">Company Logo</th>
                <th className="py-4 px-6 font-bold text-slate-900">Job Role</th>
                <th className="py-4 px-6 font-bold text-slate-900">Company Name</th>
                <th className="py-4 px-6 font-bold text-slate-900">Status Pill</th>
                <th className="py-4 px-6 font-bold text-slate-900 text-right">Applied Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No applications yet. Start hunting!</td>
                </tr>
              ) : applications.slice(0, 3).map((app, i) => (
                <tr key={app.id} className="hover:bg-primary transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 overflow-hidden">
                      {app.job.logo ? (
                         <img src={app.job.logo} alt={app.job.company} className="w-full h-full object-contain" />
                      ) : (
                         <span className="text-xs font-bold text-slate-400">{app.job.company?.charAt(0) || 'C'}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900">{app.job.title}</td>
                  <td className="py-4 px-6 text-slate-600">{app.job.company}</td>
                  <td className="py-4 px-6">
                    {app.statusStepIndex === 0 && <span className="px-3 py-1 bg-primary text-primary text-sm font-semibold rounded-full border border-primary">Applied</span>}
                    {app.statusStepIndex === 1 && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full border border-orange-200">Under Review</span>}
                    {app.statusStepIndex === 2 && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full border border-purple-200">Shortlisted</span>}
                    {app.statusStepIndex === 3 && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">Interview</span>}
                    {app.statusStepIndex === 4 && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">Selected</span>}
                    {app.statusStepIndex === 5 && <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full border border-red-200">Rejected</span>}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-right whitespace-nowrap">
                    {app.dateAppliedLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
