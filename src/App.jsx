import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layout/MainLayout';
import DashboardLayout from './layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerProfile from './pages/EmployerProfile';
import UserProfile from './pages/UserProfile';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import CandidateList from './pages/CandidateList';
import Subscription from './pages/Subscription';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import Notification from './pages/Notification';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ApproveJobs from './pages/ApproveJobs';
import AdminPayments from './pages/AdminPayments';
import Navbar from './components/Navbar';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

// OAuth Callback Handler Component
const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLoginSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      googleLoginSuccess(token)
        .then((role) => {
          if (role === 'employer') {
            navigate('/employer/dashboard');
          } else {
            navigate('/');
          }
        })
        .catch((err) => {
          console.error("Failed to login safely:", err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, googleLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Authenticating...</h2>
        <p className="text-slate-500">Please wait while we log you in.</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

// Inner component to use Auth context
const AppRoutes = () => {
  const { userRole, isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        
        {/* Public Routes with Main Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search-jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

      {/* Standalone Route for OAuth Callback */}
      <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Protected Routes: Employer Dashboard */}
          <Route element={<ProtectedRoute isAllowed={userRole === 'employer'} redirectPath="/login" />}>
            <Route path="/employer" element={<DashboardLayout />}>
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="company-profile" element={<EmployerProfile />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="manage-jobs" element={<ManageJobs />} />
              <Route path="candidate-list" element={<CandidateList />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
          </Route>
          
          {/* Protected Routes: User Dashboard */}
          <Route element={<ProtectedRoute isAllowed={userRole === 'jobseeker' || userRole === 'user'} redirectPath="/login" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<CandidateDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/applied-jobs" element={<AppliedJobs />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />
              <Route path="/notifications" element={<Notification />} />
            </Route>
          </Route>

          {/* Protected Routes: Admin */}
          <Route element={<ProtectedRoute isAllowed={userRole === 'admin'} redirectPath="/login" />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="approve-jobs" element={<ApproveJobs />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>
          </Route>

      </Routes>
    </>
  );
};

function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <AppDataProvider>
          <Router>
            <Toaster position="top-right" />
            <AppRoutes />
          </Router>
        </AppDataProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
