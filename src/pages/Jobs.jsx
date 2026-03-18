import React, { useEffect, useMemo, useState } from 'react';
import JobCard from '../components/JobCard';
import { Search, MapPin, SlidersHorizontal, Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API from '../utils/api';

const Jobs = () => {
  const locationState = useLocation();
  const params = new URLSearchParams(locationState.search);

  const [keyword, setKeyword] = useState(() => params.get('q') || '');
  const [city, setCity] = useState(() => params.get('location') || '');
  const [category, setCategory] = useState(() => params.get('category') || '');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [experience, setExperience] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Live Live Database Pipeline
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/jobs');
        if (res.data?.success) {
           setJobs(res.data.data.map(j => ({
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
        console.error("Error fetching dynamic jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const extendedJobs = useMemo(
    () =>
      jobs.map((job, index) => {
        const salaryText = job.salary || '';
        const matches = salaryText.match(/([\d,]+)/g) || [];
        const [minStr, maxStr] = matches;
        const parseAmount = (str) => (str ? Number(str.replace(/,/g, '')) : null);
        const salaryMin = parseAmount(minStr);
        const salaryMax = parseAmount(maxStr) || salaryMin;

        return {
          ...job,
          salaryMin,
          salaryMax,
          experienceLevel: job.experienceLevel || 'Fresher',
        };
      }),
    [jobs],
  );

  const resetFilters = () => {
    setKeyword('');
    setCity('');
    setCategory('');
    setJobType('');
    setSalaryRange('');
    setExperience('');
  };

  const normaliseType = (value) => value.toLowerCase().replace(/[\s-]/g, '');

  const filteredJobs = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const selectedCity = city.trim().toLowerCase();
    const selectedCategory = category;
    const selectedType = normaliseType(jobType || '');
    const selectedSalary = salaryRange;
    const selectedExperience = experience;

    return extendedJobs.filter((job) => {
      if (kw) {
        const haystack = `${job.title} ${job.company} ${job.description || ''}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }

      if (selectedCity && job.location.toLowerCase() !== selectedCity) return false;

      if (selectedCategory) {
        const jobCat = (job.category || '').toLowerCase();
        const catMap = {
          IT: ['software', 'devops', 'it'],
          Marketing: ['marketing'],
          Finance: ['finance'],
          Design: ['design', 'ui', 'ux'],
          Engineering: ['engineer', 'developer'],
        };
        const allowed = catMap[selectedCategory] || [];
        const matchCat = allowed.some((token) => jobCat.includes(token));
        if (!matchCat) return false;
      }

      if (selectedType) {
        const jobTypeNorm = normaliseType(job.type || '');
        if (selectedType === 'fulltime') {
          if (jobTypeNorm !== 'fulltime') return false;
        } else if (selectedType === 'parttime') {
          if (jobTypeNorm !== 'parttime') return false;
        } else if (selectedType === 'internship') {
          if (jobTypeNorm !== 'internship') return false;
        } else if (selectedType === 'remote') {
          if (!jobTypeNorm.includes('remote')) return false;
        }
      }

      if (selectedSalary && job.salaryMin != null) {
        const min = job.salaryMin;
        if (selectedSalary === '10-25' && !(min >= 10000 && min <= 25000)) return false;
        if (selectedSalary === '25-50' && !(min >= 25000 && min <= 50000)) return false;
        if (selectedSalary === '50-100' && !(min >= 50000 && min <= 100000)) return false;
        if (selectedSalary === '100+' && !(min >= 100000)) return false;
      }

      if (selectedExperience) {
        if (job.experienceLevel !== selectedExperience) return false;
      }

      return true;
    });
  }, [extendedJobs, keyword, city, category, jobType, salaryRange, experience]);

  useEffect(() => {
    if (params.get('q') && !keyword) setKeyword(params.get('q') || '');
    if (params.get('location') && !city) setCity(params.get('location') || '');
    if (params.get('category') && !category) setCategory(params.get('category') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState.search]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Find Your Dream Job</h1>
          <p className="text-slate-500 mt-2">
            Search and filter thousands of jobs to find the perfect opportunity.
          </p>
          <p className="text-slate-500 mt-1 text-sm">
            Showing <span className="font-semibold text-slate-900">{filteredJobs.length}</span> job
            {filteredJobs.length === 1 ? '' : 's'} matching your criteria
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            {/* Mobile toggle */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center gap-2 btn-secondary w-full mb-2"
              onClick={() => setShowFiltersMobile((prev) => !prev)}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>

            <div
              className={`card p-6 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}
            >
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filters
              </div>

              {/* 1. Job Title Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title Search
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    className="input-field pl-10"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="input-field pl-10 appearance-none cursor-pointer"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">All locations</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chandigarh">Chandigarh</option>
                  </select>
                </div>
              </div>

              {/* 3. Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  className="input-field cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              {/* 4. Job Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Job Type</label>
                <div className="space-y-3">
                  {['Full Time', 'Part Time', 'Internship', 'Remote'].map((type) => {
                    const value = type;
                    const checked = jobType === value;
                    return (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="jobType"
                          checked={checked}
                          onChange={() => setJobType(checked ? '' : value)}
                          className="w-4 h-4 border-slate-300 text-primary focus:ring-primary inline-block transition-all"
                        />
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                          {type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5. Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Salary Range</label>
                <div className="space-y-2 text-sm text-slate-600">
                  {[
                    { label: '₹10,000 – ₹25,000', value: '10-25' },
                    { label: '₹25,000 – ₹50,000', value: '25-50' },
                    { label: '₹50,000 – ₹100,000', value: '50-100' },
                    { label: '₹100,000+', value: '100+' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryRange"
                        className="w-4 h-4 border-slate-300 text-primary focus:ring-primary"
                        checked={salaryRange === opt.value}
                        onChange={() =>
                          setSalaryRange(salaryRange === opt.value ? '' : opt.value)
                        }
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Experience Level
                </label>
                <select
                  className="input-field cursor-pointer"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">All levels</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1–3 Years">1–3 Years</option>
                  <option value="3–5 Years">3–5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              {/* 7. Filter Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  className="btn-primary w-full sm:flex-1"
                  onClick={() => {}}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full sm:flex-1"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1 flex flex-col gap-5">
            {loading ? (
              <div className="card p-10 text-center text-slate-500 font-medium">
                Loading live jobs...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-slate-900 font-semibold">No jobs found</p>
                <p className="text-slate-500 text-sm mt-1">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Jobs;
