import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobs } from '../data/jobs';
import { MapPin, Briefcase, DollarSign, Clock, Calendar, CheckCircle2, Bookmark } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const job = jobs.find(j => j.id === Number(id)) || jobs[0];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 rounded-2xl border border-slate-100 flex items-center justify-center p-3 bg-slate-50 shrink-0">
                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                <p className="text-xl text-primary font-medium">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="p-3.5 rounded-xl border border-slate-200 text-slate-400 hover:text-primary hover:bg-blue-50 hover:border-blue-100 transition-colors">
                <Bookmark className="w-6 h-6" />
              </button>
              <button className="btn-primary py-3.5 px-8 text-lg w-full md:w-auto">
                Apply Now
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Location</p>
                <p className="font-semibold text-slate-900">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Salary</p>
                <p className="font-semibold text-slate-900">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Job Type</p>
                <p className="font-semibold text-slate-900">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Date Posted</p>
                <p className="font-semibold text-slate-900">{job.postedAt}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Job Description</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>{job.description}</p>
                <p>We are seeking a highly motivated and skilled individual to join our fast-growing team. In this role, you will be responsible for defining and driving our strategy, collaborating heavily with cross-functional teams.</p>
                
                <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">Responsibilities:</h3>
                <ul className="space-y-3">
                  {['Collaborate with cross-functional teams to define, design, and ship new features.', 'Ensure the performance, quality, and responsiveness of applications.', 'Identify and correct bottlenecks and fix bugs.', 'Help maintain code quality, organization, and automatization.'].map((req, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">Requirements:</h3>
                <ul className="space-y-3">
                  {['Proven software development experience and solid understanding of full lifecycle development.', 'Excellent knowledge of modern frontend frameworks, specifically React.', 'Familiarity with RESTful APIs to connect applications to back-end services.', 'Strong understanding of UI design principles and patterns.'].map((req, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-8 bg-primary/5 border-none">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About Company</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl border border-slate-100 flex items-center justify-center p-2 bg-white shrink-0">
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{job.company}</h4>
                  <Link to="#" className="text-primary hover:underline text-sm font-medium">View Profile</Link>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                {job.company} is a leading global technology company specializing in internet-related services and products.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-500">Founded in:</span>
                  <span className="font-medium text-slate-900">2010</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Company size:</span>
                  <span className="font-medium text-slate-900">100 - 500</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-900">+1 234 567 8900</span>
                </li>
              </ul>
              <button className="btn-secondary w-full mt-6 text-sm">Follow Company</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;
