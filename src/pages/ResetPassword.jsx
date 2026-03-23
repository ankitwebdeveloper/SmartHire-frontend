import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.put(`/auth/resetpassword/${token}`, { password });

      toast.success('Password reset successfully!');
      navigate('/login');
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
          Create New Password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Please enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center gap-2">
              {loading ? 'Reseting...' : 'Reset Password'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
