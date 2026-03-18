import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';
import { useAuth } from './AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

/* eslint-disable react-refresh/only-export-components */
const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  candidateResume: 'smarthire.candidateResume.v1',
  companyLogo: 'smarthire.companyLogo.v1',
};

// Maps backend application status to visual timeline UI step index
const statusMap = { 'applied': 0, 'under_review': 1, 'shortlisted': 2, 'interview': 3, 'selected': 4, 'rejected': 5 };

export function AppDataProvider({ children }) {
  const { user, isAuthenticated, userRole } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [employerJobs, setEmployerJobs] = useState([]);

  // Retain these in localStorage explicitly since they are physical files/cache uploads intended for future draft edits
  const [candidateResume, setCandidateResume] = useLocalStorageState(STORAGE_KEYS.candidateResume, null);
  const [companyLogo, setCompanyLogo] = useLocalStorageState(STORAGE_KEYS.companyLogo, null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      // Clear all state on logout prevents data bleeding
      setSavedJobs([]);
      setApplications([]);
      setNotifications([]);
      setEmployerJobs([]);
    }
  }, [isAuthenticated, userRole]);

  const fetchAllData = async () => {
    try {
      // 1. Fetch Global Notifications (Everyone)
      const notifRes = await API.get('/notifications').catch(() => ({ data: { data: [] } }));
      if (notifRes.data?.data) {
        setNotifications(notifRes.data.data.map(n => ({
          id: n._id,
          type: n.type || 'info',
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleDateString(),
          unread: !n.isRead
        })));
      }

      // 2. Fetch Role Specific Data Pipeline
      if (userRole === 'jobseeker') {
        const [savedRes, appsRes] = await Promise.all([
          API.get('/saved-jobs').catch(() => ({ data: { data: [] } })),
          API.get('/applications/me').catch(() => ({ data: { data: [] } }))
        ]);

        if (savedRes.data?.data) {
          // Flatten mapping to match exactly what SavedJobs.jsx natively loops over
          setSavedJobs(savedRes.data.data.map(s => ({
            id: s.jobId?._id,
            _id: s.jobId?._id,
            title: s.jobId?.jobTitle,
            company: s.jobId?.companyName,
            logo: s.jobId?.companyLogo,
            location: s.jobId?.location,
            dateSaved: s.savedAt
          })));
        }

        if (appsRes.data?.data) {
           // Deep mapping for App nested job lookup
          setApplications(appsRes.data.data.map(a => ({
            id: a._id,
            job: {
              id: a.jobId?._id,
              title: a.jobId?.jobTitle,
              company: a.jobId?.companyName,
              logo: a.jobId?.companyLogo,
              location: a.jobId?.location
            },
            statusStepIndex: statusMap[a.status] || 0,
            dateAppliedLabel: new Date(a.appliedDate).toLocaleDateString()
          })));
        }

      } else if (userRole === 'employer') {
        const jobsRes = await API.get('/jobs/employer').catch(() => ({ data: { data: [] } }));
        if (jobsRes.data?.data) {
          setEmployerJobs(jobsRes.data.data.map(j => ({
            id: j._id,
            title: j.jobTitle,
            apps: j.applicationsCount || 0, // Wait for backend aggregation logic inside Phase 16 if required
            date: new Date(j.createdAt).toLocaleDateString(),
            status: j.approvalStatus === 'approved' ? 'Active' : (j.approvalStatus === 'pending' ? 'Pending' : 'Draft')
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching dynamic app data:", error);
    }
  };

  const api = useMemo(() => {
    
    // Core check UI uses for Heart/Bookmark icons
    const isJobSaved = (targetJobId) => savedJobs.some((j) => String(j.id) === String(targetJobId));

    const toggleSavedJob = async (job) => {
      const targetJobId = job._id || job.id;
      const alreadySaved = savedJobs.find(j => String(j.id) === String(targetJobId));
      
      try {
        if (alreadySaved) {
          await API.delete(`/saved-jobs/${targetJobId}`);
          setSavedJobs((prev) => prev.filter(j => String(j.id) !== String(targetJobId)));
          toast.success("Job removed from saved list");
        } else {
          const res = await API.post(`/saved-jobs/${targetJobId}`);
          if (res.data?.success) {
            fetchAllData(); // Refresh clean populate layer from backend automatically
            toast.success("Job saved successfully!");
          }
        }
      } catch (err) {
        console.error("Save job error", err);
        if (err.response?.status === 409) {
           toast.error("You already saved this job");
        } else {
           toast.error("Failed to update saved job");
        }
      }
    };

    const addApplication = async (payload) => {
      try {
         const targetJobId = payload.job.id || payload.job._id;
         // The payload comes from ApplyJobModal containing { job, applicant, resume }
         // The backend naturally extracts the candidate ID from the JWT token and associates Resume via Profile later
         const res = await API.post(`/applications/${targetJobId}`, {
             resumeData: payload.resume // Can be wired up internally inside the backend to auto-update UserProfile if requested
         });
         
         if (res.data?.success) {
            toast.success("Application submitted successfully!");
            fetchAllData(); // Refresh the pipeline so 'Applied Jobs' dashboard increments immediately
         }
      } catch (err) {
         console.error("Application Failed:", err);
         toast.error(err.response?.data?.message || "Failed to submit application");
         throw err; // Re-throw to inform ApplyJobModal's try/catch loop so it can handle visual errors
      }
    };

    const updateApplicationStatus = async () => {};

    const markAllNotificationsRead = async () => {
       // Optimistic UI clear
       setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
       
       // Background API flush
       notifications.filter(n => n.unread).forEach(n => API.patch(`/notifications/${n.id}/read`).catch(()=>{}));
    };

    const addEmployerJob = () => {};
    const editEmployerJob = () => {};
    const deleteEmployerJob = () => {};

    return {
      savedJobs,
      isJobSaved,
      toggleSavedJob,

      applications,
      addApplication,
      updateApplicationStatus,

      notifications,
      markAllNotificationsRead,
      setNotifications,

      candidateResume,
      setCandidateResume,

      companyLogo,
      setCompanyLogo,

      employerJobs,
      addEmployerJob,
      editEmployerJob,
      deleteEmployerJob,
    };
  }, [
    savedJobs,
    applications,
    notifications,
    candidateResume,
    setCandidateResume,
    companyLogo,
    setCompanyLogo,
    employerJobs
  ]);

  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
