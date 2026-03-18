import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import JobCard from '../components/JobCard';
import CategoryCard from '../components/CategoryCard';
import { companies } from '../data/companies';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import API from '../utils/api';

const Home = () => {
  const categories = [
    { id: 1, title: 'Software Development', openPositions: 124, iconType: 'code', bgColorClass: 'bg-blue-100', textColorClass: 'text-blue-600' },
    { id: 2, title: 'Design & Creative', openPositions: 45, iconType: 'design', bgColorClass: 'bg-purple-100', textColorClass: 'text-purple-600' },
    { id: 3, title: 'Marketing & PR', openPositions: 68, iconType: 'marketing', bgColorClass: 'bg-orange-100', textColorClass: 'text-orange-600' },
    { id: 4, title: 'Business & Sales', openPositions: 92, iconType: 'business', bgColorClass: 'bg-green-100', textColorClass: 'text-green-600' },
  ];

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/jobs?limit=4');
        if (res.data?.success) {
           setFeaturedJobs(res.data.data.map(j => ({
             id: j._id,
             title: j.jobTitle,
             company: j.companyName,
             logo: j.companyLogo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(j.companyName || 'C'),
             location: j.location,
             description: j.description,
             category: j.category,
             type: j.jobType,
             salary: j.salaryRange,
             experienceLevel: j.experienceLevel
           })));
        }
      } catch (err) {
        console.error("Error fetching home jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <Hero />

      {/* Featured Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Jobs</h2>
              <p className="text-slate-500 max-w-2xl">
                Discover the latest job openings from top companies around the world. Apply to your dream job today.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="text-center text-slate-500 py-10">Loading latest opportunities...</div>
            ) : featuredJobs.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No live jobs posted yet! Check back soon.</div>
            ) : featuredJobs.map(job => (
              <JobCard key={job.id} job={job} isFeatured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Popular Categories</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Explore diverse job categories to find the perfect fit for your skills and career aspirations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat.id}
                title={cat.title}
                openPositions={cat.openPositions}
                iconType={cat.iconType}
                bgColorClass={cat.bgColorClass}
                textColorClass={cat.textColorClass}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Hiring */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Top Companies Hiring</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Join the most innovative companies. Work with top teams globally.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-500">
            {companies.map(company => (
              <div key={company.id} className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                How SmartHire Works For You
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We make the job search process simple and efficient. Create a profile, find relevant jobs, and apply with ease.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Create Your Profile", desc: "Sign up and build your professional profile." },
                  { title: "Search For Jobs", desc: "Browse thousands of job listings matching your skills." },
                  { title: "Apply With One Click", desc: "Easily apply to jobs using your SmartHire profile." }
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[500px] w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team matching" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
