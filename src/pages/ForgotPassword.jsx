import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgotpassword', { email });

      setIsSent(true);
      toast.success('Password reset link sent to your email');
      // If simulated, also log it or show it for dev
      if (data.resetToken) {
        console.log(`[Dev] Reset link: http://localhost:5173/reset-password/${data.resetToken}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Failed to connect to the server');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email to get a reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          {isSent ? (
            <div className="text-center">
              <div className="mb-4 text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                Check your email for the reset link!
              </div>
              <p className="text-sm text-slate-500 mb-6">
                If you don't receive an email, please check your spam folder or try again.
              </p>
              <Link to="/login" className="w-full btn-primary flex justify-center items-center">
                Back to Sign in
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center gap-2">
                {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-medium text-primary hover:text-primary">
                  Back to Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
