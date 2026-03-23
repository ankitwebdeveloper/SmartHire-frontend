import React, { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keywords.trim()) params.set('q', keywords.trim());
    if (location.trim()) params.set('location', location.trim());
    if (category) params.set('category', category);
    const query = params.toString();
    navigate(query ? `/jobDetails?${query}` : '/search-jobs');
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex flex-col lg:flex-row gap-2 mt-8 w-full z-10 relative"
    >
      <div className="flex-1 flex items-center px-4 py-3 lg:py-0 border-b lg:border-b-0 lg:border-r border-slate-100 min-h-[56px]">
        <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="Job title, keywords..." 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>
      
      <div className="flex-1 flex items-center px-4 py-3 lg:py-0 border-b lg:border-b-0 lg:border-r border-slate-100 min-h-[56px]">
        <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="City or postcode" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1 flex items-center px-4 py-3 lg:py-0 min-h-[56px]">
        <Briefcase className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
        <select
          className="w-full bg-transparent border-none focus:outline-none text-slate-700 cursor-pointer appearance-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="software">Software Development</option>
          <option value="design">Design & Creative</option>
          <option value="marketing">Marketing & PR</option>
          <option value="business">Business & Sales</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn-primary py-4 lg:py-3 whitespace-nowrap mt-2 lg:mt-0 rounded-xl min-h-[56px] w-full lg:w-auto"
      >
        Search Jobs
      </button>
    </form>
  );
};

export default SearchBar;
