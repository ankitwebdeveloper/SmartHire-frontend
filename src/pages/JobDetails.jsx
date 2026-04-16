import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import ApplyJobModal from '../components/ApplyJobModal';

// Modular Layout Components
import JobHeader from '../components/job-details/JobHeader';
import JobDescription from '../components/job-details/JobDescription';
import SimilarJobs from '../components/job-details/SimilarJobs';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { isJobSaved, toggleSavedJob } = useAppData();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [applyOpen, setApplyOpen] = useState(false);

  const fetchJobDetails = async () => {
    window.scrollTo(0, 0); // Reset scroll position when jumping to a new job natively
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/jobs/${id}`);
      if (res.data?.success) {
        const j = res.data.data;
        const mappedJob = {
           id: j._id,
           title: j.jobTitle,
           company: j.companyName,
           logo: j.companyLogo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(j.companyName || 'C'),
           location: j.location,
           description: j.jobDescription,
           category: j.category,
           type: j.jobType,
           salary: (j.salaryMin && j.salaryMax) ? `₹${j.salaryMin} - ₹${j.salaryMax}` : j.salaryMin ? `₹${j.salaryMin}` : 'Not specified',
           experienceLevel: j.experienceLevel || 'Fresher',
           postedAt: new Date(j.createdAt).toLocaleDateString(),
        };
        setJob(mappedJob);
        fetchRelatedJobs(mappedJob.category, mappedJob.id);
      } else {
        setError('Job not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load job details. It may be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedJobs = async (cat, currentId) => {
    if (!cat) return;
    try {
      setLoadingRelated(true);
      const res = await API.get(`/jobs?category=${cat}&limit=6`);
      if (res.data?.success) {
         let fetched = res.data.data.filter(j => j._id !== currentId).map(j => ({
           id: j._id,
           title: j.jobTitle,
           company: j.companyName,
           logo: j.companyLogo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(j.companyName || 'C'),
           location: j.location,
           category: j.category,
           type: j.jobType,
           salary: (j.salaryMin && j.salaryMax) ? `₹${j.salaryMin} - ₹${j.salaryMax}` : j.salaryMin ? `₹${j.salaryMin}` : 'Not specified'
         })).slice(0, 5);
         setRelatedJobs(fetched);
      }
    } catch (err) {
      console.error("Error fetching related jobs:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) return navigate('/login');
    if (userRole === 'employer') return navigate(`/${userRole}/dashboard`);
    setApplyOpen(true);
  };

  const handleSave = () => {
    if (!isAuthenticated) return navigate('/login');
    if (job) toggleSavedJob(job);
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-20 flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading modern job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-20 flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
        <p className="text-slate-500 font-medium">{error || 'Job not found'}</p>
        <Link to="/search-jobs" className="btn-primary mt-4 hover:scale-105 transition-transform duration-300">Back to Jobs</Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MODULAR LAYOUT ENGINES */}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left Column: 70%, meaning col-span-8 approx) */}
          <div className="col-span-1 lg:col-span-8 xl:col-span-8 flex flex-col">
            
            {/* Top Header Card */}
            <JobHeader 
               job={job} 
               saved={saved} 
               handleSave={handleSave} 
               handleApply={handleApply} 
            />

            {/* Core Job Description Render */}
            <JobDescription job={job} />
            
          </div>

          {/* Right Sidebar (Right Column: 30%, meaning col-span-4 approx) */}
          <div className="col-span-1 lg:col-span-4 xl:col-span-4">
             <SimilarJobs jobs={relatedJobs} variant="vertical" loading={loadingRelated} />
          </div>

        </div>

      </div>
      
      {/* Dynamic Apply logic */}
      <ApplyJobModal open={applyOpen} job={job} onClose={() => setApplyOpen(false)} />
    </div>
  );
};

export default JobDetails;
