import React from 'react';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    
    <div className="relative bg-[#F8FAFC] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] -z-10 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center pt-20 pb-16 lg:pt-32 lg:pb-16 gap-12">
          
          {/* Left Content */}
          <div className="flex-1 w-full relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-primary font-semibold text-sm mb-6">
              #1 Job Portal Network
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              <span className="block text-primary"></span>
              <span className="block mt-2">
                Find <span className="text-primary relative inline-block">
                  Candidate
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                  </svg>
                </span>
              </span>
              <span className="block">For Your Needs</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
              Jobs & job search. Find jobs globally. Discover thousands of job opportunities and connect with top employers.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] object-cover" 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt={`Candidate ${i}`} 
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] bg-primary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  10k+
                </div>
              </div>
              <div>
                <p className="text-slate-900 font-semibold">10k+ Candidates</p>
                <p className="text-slate-500 text-sm">are already registered</p>
              </div>
            </div>
          </div>

          {/* Right Image (Diagonal layout visual) */}
          <div className="flex-1 w-full lg:h-[600px] relative hidden lg:flex flex-col items-center justify-center gap-6">
            <div className="relative w-full h-[400px] xl:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Professional Office" 
                className="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"
              />
            </div>
          </div>

        </div>

        {/* Search Bar Correctly Contained */}
        <div className="w-full pb-24 relative z-20 flex justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;
