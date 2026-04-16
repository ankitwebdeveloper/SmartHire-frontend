import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, isAuthenticated, userRole } = useAuth();
  const [userType, setUserType] = useState('jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(name, email, password, userType);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `https://smarthire-backend-1.onrender.com/api/auth/google?state=${userType}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="bg-primary p-2 rounded-xl">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            SmartHire<span className="text-primary">.</span>
          </span>
        </Link>
        <h2 className="mt-2 text-3xl tracking-tight font-bold text-slate-900">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          
          {/* Role Selection Options */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <button 
              onClick={() => setUserType('jobseeker')}
              className={`p-4 border rounded-xl text-center transition-all flex flex-col items-center justify-center gap-2 ${
                userType === 'jobseeker' 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-slate-200 hover:border-primary/50 text-slate-500'
              }`}
            >
              <User className={userType === 'jobseeker' ? "text-primary w-5 h-5" : "text-slate-400 w-5 h-5"} />
              <div>
                <div className="font-bold mb-1 text-slate-900 leading-none">User</div>
                <div className="text-xs">Find jobs</div>
              </div>
            </button>
            <button 
              onClick={() => setUserType('employer')}
              className={`p-4 border rounded-xl text-center transition-all flex flex-col items-center justify-center gap-2 ${
                userType === 'employer' 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-slate-200 hover:border-primary/50 text-slate-500'
              }`}
            >
              <Building2 className={userType === 'employer' ? "text-primary w-5 h-5" : "text-slate-400 w-5 h-5"} />
              <div>
                <div className="font-bold mb-1 text-slate-900 leading-none">Employer</div>
                <div className="text-xs">Hire talent</div>
              </div>
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="input-field"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-900">
                I agree to the <a href="#" className="font-medium text-primary hover:text-primary">Terms</a> and <a href="#" className="font-medium text-primary hover:text-primary">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex justify-center items-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center flex-col md:flex-row items-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-500 hover:bg-primary transition-colors">
                <svg className="h-5 w-5 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
