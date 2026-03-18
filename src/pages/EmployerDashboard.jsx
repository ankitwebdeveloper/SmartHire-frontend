import React from 'react';
import { Users, FileText, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="card p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-primary/10 rounded-xl">
        {React.createElement(icon, { className: 'w-6 h-6 text-primary' })}
      </div>
    </div>
    <div className={`flex items-center gap-2 mt-4 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
      <TrendingUp className="w-4 h-4" />
      <span>{trend} vs last month</span>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const { employerJobs } = useAppData();

  const totalJobs = employerJobs.length;
  const totalApps = employerJobs.reduce((acc, job) => acc + (job.apps || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Employer Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Jobs Posted" value={totalJobs || 0} icon={FileText} trend="+2.5%" trendUp={true} />
        <StatCard title="Total Applications" value={totalApps || 0} icon={Users} trend="+12.4%" trendUp={true} />
        <StatCard title="Hired Candidates" value="0" icon={CheckCircle} trend="0.0%" trendUp={true} />
        <StatCard title="Profile Views" value="0" icon={BarChart3} trend="0.0%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Applications */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
            <button className="text-sm font-semibold text-primary hover:text-blue-700">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-4 font-medium">Candidate Name</th>
                  <th className="pb-4 font-medium">Applied Job</th>
                  <th className="pb-4 font-medium">Date Applied</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No applications received yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6 text-center text-slate-500 py-6">
             No recent activity directly related to your jobs.
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;
