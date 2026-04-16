import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, User, LogOut, ChevronDown, LayoutDashboard, UserCircle, FileText, Bookmark, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, userRole, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  const handlePostJobClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userRole === 'employer') {
      navigate('/employer/post-job');
    } else {
      // Candidates shouldn't post job, redirecting to search
      navigate('/jobs');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-accent text-white border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              SmartHire<span className="text-white">.</span>
            </span>
          </Link>
          
          
          {/* Centered Navigation for Visitors */}
          {!isAuthenticated && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-end pb-1 gap-8">
              <Link to="/" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Home
              </Link>
              <button 
                onClick={handlePostJobClick} 
                className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/employer/post-job' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}
              >
                Post Job
              </button>
            </div>
          )}

          {/* Centered Navigation for Jobseeker */}
          {isAuthenticated && userRole === 'jobseeker' && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-end pb-1 gap-8">
              <Link to="/dashboard" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/dashboard' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Dashboard
              </Link>
              <Link to="/search-jobs" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/search-jobs' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Search Jobs
              </Link>
              <Link to="/applied-jobs" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/applied-jobs' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Applied Jobs
              </Link>
              <Link to="/saved-jobs" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/saved-jobs' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Saved Jobs
              </Link>
            </div>
          )}

          {/* Centered Navigation for Employer */}
          {isAuthenticated && userRole === 'employer' && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-end pb-1 gap-8">
              <Link to="/employer/dashboard" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/employer/dashboard' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Dashboard
              </Link>
              <Link to="/employer/post-job" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/employer/post-job' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Post Job
              </Link>
              <Link to="/employer/manage-jobs" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/employer/manage-jobs' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                My Jobs
              </Link>
              <Link to="/employer/candidate-list" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/employer/candidate-list' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Candidates
              </Link>
            </div>
          )}

          {/* Centered Navigation for Admin */}
          {isAuthenticated && userRole === 'admin' && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-end pb-1 gap-8">
              <Link to="/admin/dashboard" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/admin/dashboard' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Admin Dashboard
              </Link>
              <Link to="/admin/post-job" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/admin/post-job' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Post Job
              </Link>
              <Link to="/admin/manage-users" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/admin/manage-users' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Manage Users
              </Link>
              <Link to="/admin/approve-jobs" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/admin/approve-jobs' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Approve Jobs
              </Link>
              <Link to="/admin/payments" className={`text-sm font-medium pb-4 border-b-2 px-1 transition-colors ${location.pathname === '/admin/payments' ? 'border-primary text-white' : 'border-transparent text-white hover:text-white hover:border-slate-300'}`}>
                Payments
              </Link>
            </div>
          )}

          {/* Right Side: Auth & Actions */}
          <div className="hidden md:flex items-center justify-end gap-3 z-10 w-[250px]">
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-sm font-medium text-white hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm font-medium px-4 py-2">
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <div className="relative flex items-center gap-4" ref={profileRef}>
                {(userRole === 'jobseeker' || userRole === 'employer') && (
                  <button onClick={() => navigate('/notifications')} className="text-white hover:text-white transition-colors p-2 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                )}
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-primary p-2 rounded-xl transition-colors"
                >
                  <span className="text-sm font-semibold text-white hidden lg:block">{user?.name || 'User'}</span>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-slate-200" style={{ borderRadius: '50%' }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-primary rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-2" onClick={() => setIsProfileOpen(false)}>
                    <Link to={userRole === 'employer' ? '/employer/company-profile' : userRole === 'admin' ? '/admin/dashboard' : '/profile'} className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-primary hover:text-white transition-colors">
                      <UserCircle className="w-4 h-4 text-white" /> Profile
                    </Link>
                    <div className="h-px bg-primary my-2"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-primary to-accent text-white border-b border-primary/20 p-4">
          <div className="flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                  Home
                </Link>
                <button onClick={() => { handlePostJobClick(); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors text-left">
                  Post Job
                </button>
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                  Blog
                </Link>
                <div className="h-px bg-primary my-2"></div>
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center w-full">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center w-full">
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2 px-2 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-slate-200" style={{ borderRadius: '50%' }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs font-medium text-white capitalize bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1">{userRole}</div>
                  </div>
                  {(userRole === 'jobseeker' || userRole === 'employer') && (
                    <button onClick={() => { navigate('/notifications'); setIsOpen(false); }} className="text-white relative p-2">
                      <Bell className="w-6 h-6" />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                  )}
                </div>
                
                {userRole === 'jobseeker' && (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Dashboard
                    </Link>
                    <Link to="/search-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Search Jobs
                    </Link>
                    <Link to="/applied-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Applied Jobs
                    </Link>
                    <Link to="/saved-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Saved Jobs
                    </Link>
                  </>
                )}

                {userRole === 'employer' && (
                  <>
                    <Link to="/employer/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Dashboard
                    </Link>
                    <Link to="/employer/post-job" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Post Job
                    </Link>
                    <Link to="/employer/manage-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       My Jobs
                    </Link>
                    <Link to="/employer/candidate-list" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Candidates
                    </Link>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Admin Dashboard
                    </Link>
                    <Link to="/admin/post-job" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Post Job
                    </Link>
                    <Link to="/admin/manage-users" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Manage Users
                    </Link>
                    <Link to="/admin/approve-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Approve Jobs
                    </Link>
                    <Link to="/admin/payments" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                       Payments
                    </Link>
                  </>
                )}
                
                <div className="h-px bg-primary my-1"></div>
                
                <Link to={userRole === 'employer' ? '/employer/company-profile' : userRole === 'admin' ? '/admin/dashboard' : '/profile'} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-primary rounded-lg transition-colors">
                  <UserCircle className="w-5 h-5 text-white" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg w-full text-left transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
