import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Building2, MapPin, DollarSign, Briefcase, Plus, X, Rocket, Info, Wallet } from 'lucide-react';
import API from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 1, title: 'Job Details' },
  { id: 2, title: 'Requirements' },
  { id: 3, title: 'Preview' },
  { id: 4, title: 'Publishing' }
];

const PRICING_PLANS = [
  { id: 'basic', name: 'Basic', price: '₹999', period: '', features: ['Post up to 3 jobs', 'Standard visibility', 'Basic analytics'] },
  { id: 'standard', name: 'Standard', price: '₹1999', period: '', features: ['Post up to 7 jobs', 'Medium reach', 'Highlighted banner'] },
  { id: 'premium', name: 'Premium', price: '₹2999', period: '', features: ['Post up to 15 jobs', 'Featured priority listing', 'Top positions'] }
];

const PostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resumeDraftFlag = location.state?.resumeDraft;

  const { user, updateUser } = useAuth(); // Assume optional hook to refetch profile
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const userCredits = user?.remainingJobCredits || 0;
  const hasCredits = userCredits > 0;

  // Form State (STRICTLY EMPTY INITIALIZATIONS to enforce Dropdown Selection Constraints)
  const [form, setForm] = useState({
    title: '',
    company: '', 
    description: '',
    location: '',
    jobType: '',
    category: '',
    salaryMin: '',
    salaryMax: '',
    skills: [],
    experience: '',
    education: '',
    openings: '',
    gender: 'Any',
    ageLimit: ''
  });

  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');

  // Payment State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  // ----------------------------------
  // DRAFTING & LIFECYCLE 
  // ----------------------------------
  useEffect(() => {
     const fetchDraft = async () => {
        try {
           const res = await API.get('/jobs/draft');
           if (res.data?.data) {
              const d = res.data.data;
              setForm(prev => ({
                 ...prev,
                 title: d.jobTitle || '',
                 company: d.companyName || '',
                 location: d.location || '',
                 jobType: d.jobType || '',
                 salaryMin: d.salaryMin || '',
                 salaryMax: d.salaryMax || '',
                 description: d.jobDescription || '',
                 skills: d.requiredSkills || [],
                 experience: d.experienceLevel || '',
                 education: d.education || '',
                 openings: d.openings || '',
                 gender: d.gender || 'Any',
                 ageLimit: d.ageLimit || ''
              }));
              
              if (resumeDraftFlag) {
                 setStep(4); 
                 toast.success(hasCredits ? "Draft session mapped. Spend a credit to publish!" : "Draft session mapped. Complete your payment to publish!");
              } else {
                 toast.success("Recovered your saved Job Draft smoothly.");
              }
           }
        } catch (err) {
           console.log("No existing draft found.", err);
        } finally {
           setInitialLoad(false);
        }
     };
     fetchDraft();
  }, [resumeDraftFlag, hasCredits]);

  const saveLiveDraft = async () => {
     try {
        const payload = {
            title: form.title,
            company: form.company || user?.companyName,
            location: form.location,
            salary: form.salaryMin && form.salaryMax ? `${form.salaryMin} - ${form.salaryMax}` : '',
            jobType: form.jobType,
            category: form.category,
            experience: form.experience,
            description: form.description, 
            education: form.education,
            requiredSkills: form.skills,
            openings: parseInt(form.openings) || undefined,
            gender: form.gender,
            ageLimit: form.ageLimit,
        };
        await API.post('/jobs/draft', payload);
        toast.success(hasCredits ? "Draft securely synced! Proceed below." : "Your draft is saved. Complete payment to publish job.", { icon: '📝' });
     } catch(err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to sync Draft remotely.";
        toast.error(`Draft Error: ${errorMsg}`);
     }
  }

  // ----------------------------------
  // STRICT VALIDATION & PROGRESSION 
  // ----------------------------------
  const validateStep = (currentStep) => {
     const newErrors = {};
     let isValid = true;

     if (currentStep === 1) {
        if (!form.title.trim()) { newErrors.title = 'Job Title is required'; isValid = false; }
        if (!form.company.trim()) { newErrors.company = 'Company is required'; isValid = false; }
        if (!form.location.trim()) { newErrors.location = 'Location is required'; isValid = false; }
        if (!form.jobType) { newErrors.jobType = 'Please select an option'; isValid = false; }
        if (!form.category) { newErrors.category = 'Please select an option'; isValid = false; }
        if (!form.description.trim()) { newErrors.description = 'Job Description is required'; isValid = false; }
     }

     if (currentStep === 2) {
        if (!form.experience) { newErrors.experience = 'Please select an option'; isValid = false; }
        if (!form.education) { newErrors.education = 'Please select an option'; isValid = false; }
        if (!form.openings || parseInt(form.openings) < 1) { newErrors.openings = 'Valid openings count required'; isValid = false; }
     }

     setErrors(newErrors);
     return isValid;
  };

  const handleNext = () => {
     if (validateStep(step)) {
        if (step === 3) {
            saveLiveDraft();
        }
        setStep(s => Math.min(s + 1, 4));
     } else {
        toast.error("Please fix the dynamic validation errors before proceeding.");
     }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const onChange = (key) => (e) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  }

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
       setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
       setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const validatePayment = () => {
     if (paymentMethod === 'upi') {
         const upiRegex = /^[\w.-]+@[\w.-]+$/;
         if (!upiRegex.test(upiId.trim())) return 'Invalid UPI Format (e.g. yourname@bank)';
     }
     if (paymentMethod === 'card') {
         const cardRegex = /^\d{16}$/;
         const cvvRegex = /^\d{3}$/;
         const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

         if (!cardRegex.test(cardDetails.number.replace(/\s+/g, ''))) return 'Card must be exactly 16 digits';
         if (!expRegex.test(cardDetails.expiry)) return 'Expiry must match MM/YY format';
         if (!cvvRegex.test(cardDetails.cvv)) return 'CVV must be exactly 3 digits';
     }
     return null;
  }

  const submitListing = async (e) => {
    e?.preventDefault();
    if (!hasCredits && step === 4) {
       if (!selectedPlan) return toast.error('Please select a pricing plan.');
       if (!paymentMethod) return toast.error('Please select a payment method.');
       
       const pError = validatePayment();
       if (pError) return toast.error(pError);
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        company: form.company || user?.companyName,
        location: form.location,
        salary: form.salaryMin && form.salaryMax ? `${form.salaryMin} - ${form.salaryMax}` : '',
        jobType: form.jobType,
        category: form.category,
        experience: form.experience,
        description: form.description, 
        education: form.education,
        requiredSkills: form.skills,
        openings: parseInt(form.openings) || undefined,
        gender: form.gender,
        ageLimit: form.ageLimit,
        selectedPlan: selectedPlan // if null (hasCredits is true), controller handles safely mapping to null dropping exactly 1 credit!
      };

      await API.post('/jobs', payload);
      
      // Ping generic global refresh if standard hook exposes it to update generic navbar bounds natively
      if (typeof updateUser === 'function') {
         updateUser();
      }

      setStep(5);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit job');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoad) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Checking Setup States...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {step < 5 && (
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>
             <p className="text-slate-500 mt-1">Complete the steps below to craft the perfect job listing.</p>
           </div>
        )}

        {/* Stepper Progress UI */}
        {step < 5 && (
           <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
             {STEPS.map((s, index) => (
               <div key={s.id} className="flex-1 flex items-center">
                  <div className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${step >= s.id ? 'bg-primary border-primary text-white shadow-md' : 'border-slate-200 bg-slate-50'}`}>
                        {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                     </div>
                     <span className="text-xs sm:text-sm font-semibold hidden sm:block whitespace-nowrap text-center px-2">{s.title}</span>
                  </div>
                  {index !== STEPS.length - 1 && (
                     <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-colors ${step > s.id ? 'bg-primary' : 'bg-slate-200'}`}></div>
                  )}
               </div>
             ))}
           </div>
        )}

        <div className="card p-6 md:p-10 min-h-[500px] flex flex-col shadow-sm border border-slate-100 bg-white">
          
          {/* STEP 1: JOB DETAILS */}
          {step === 1 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                  <input type="text" placeholder="e.g. Frontend Developer" className={`input-field ${errors.title ? 'border-red-500 bg-red-50' : ''}`} value={form.title} onChange={onChange('title')} />
                  {errors.title && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.title}</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                  <input type="text" placeholder="e.g. SmartHire Inc" className={`input-field ${errors.company ? 'border-red-500 bg-red-50' : ''}`} value={form.company} onChange={onChange('company')} />
                  {errors.company && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.company}</span>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                  <input type="text" placeholder="e.g. Mumbai, Maharashtra" className={`input-field ${errors.location ? 'border-red-500 bg-red-50' : ''}`} value={form.location} onChange={onChange('location')} />
                  {errors.location && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.location}</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type *</label>
                  <select className={`input-field cursor-pointer ${errors.jobType ? 'border-red-500 bg-red-50' : ''}`} value={form.jobType} onChange={onChange('jobType')}>
                    <option value="" disabled>Select an option</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                  {errors.jobType && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.jobType}</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                  <select className={`input-field cursor-pointer ${errors.category ? 'border-red-500 bg-red-50' : ''}`} value={form.category} onChange={onChange('category')}>
                    <option value="" disabled>Select an option</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.category}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Minimum (₹)</label>
                  <input type="number" placeholder="e.g. 500000" className="input-field" value={form.salaryMin} onChange={onChange('salaryMin')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Maximum (₹)</label>
                  <input type="number" placeholder="e.g. 800000" className="input-field" value={form.salaryMax} onChange={onChange('salaryMax')} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description *</label>
                  <textarea rows="5" placeholder="Describe the day-to-day responsibilities..." className={`input-field resize-y ${errors.description ? 'border-red-500 bg-red-50' : ''}`} value={form.description} onChange={onChange('description')} />
                  {errors.description && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.description}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS */}
          {step === 2 && (
            <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Candidate Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Required Skills</label>
                  <div className="flex gap-2 mb-3">
                     <input 
                       type="text" 
                       placeholder="e.g. React.js (Press Enter to add)" 
                       className="input-field flex-1" 
                       value={skillInput} 
                       onChange={(e) => setSkillInput(e.target.value)} 
                       onKeyDown={handleSkillKeyDown}
                     />
                     <button type="button" onClick={addSkill} className="btn-secondary px-4"><Plus className="w-5 h-5"/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     {form.skills.length === 0 && <span className="text-slate-400 text-sm italic">Added skills will appear here...</span>}
                     {form.skills.map((s, i) => (
                       <span key={i} className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                         {s} <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => removeSkill(s)}/>
                       </span>
                     ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level *</label>
                  <select className={`input-field cursor-pointer ${errors.experience ? 'border-red-500 bg-red-50' : ''}`} value={form.experience} onChange={onChange('experience')}>
                    <option value="" disabled>Select an option</option>
                    <option value="fresher">Fresher</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  {errors.experience && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.experience}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Education Requirements *</label>
                  <select className={`input-field cursor-pointer ${errors.education ? 'border-red-500 bg-red-50' : ''}`} value={form.education} onChange={onChange('education')}>
                    <option value="" disabled>Select an option</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                  {errors.education && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.education}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Openings *</label>
                  <input type="number" placeholder="e.g. 5" className={`input-field ${errors.openings ? 'border-red-500 bg-red-50' : ''}`} value={form.openings} onChange={onChange('openings')} min="1" />
                  {errors.openings && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.openings}</span>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Gender (Optional)</label>
                  <select className="input-field cursor-pointer" value={form.gender} onChange={onChange('gender')}>
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Age Limit (Optional)</label>
                  <input type="text" placeholder="e.g. 18 - 35 years" className="input-field" value={form.ageLimit} onChange={onChange('ageLimit')} />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 w-full">
               <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Job Preview</h2>
               
               <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 relative shadow-sm max-w-2xl mx-auto">
                  <div className="flex gap-4 items-center mb-6 border-b border-slate-200 pb-6">
                     <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-3 shrink-0">
                        <Building2 className="w-8 h-8 text-slate-300" />
                     </div>
                     <div>
                       <h3 className="text-2xl font-bold text-slate-900">{form.title || 'Untitled Job Role'}</h3>
                       <p className="text-primary font-semibold">{form.company || 'Your Company Name'}</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-600 font-medium pb-6 border-b border-slate-200">
                     <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm"><MapPin className="w-4 h-4 text-slate-400" /> {form.location || 'Location'}</span>
                     <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm"><DollarSign className="w-4 h-4 text-slate-400" /> {form.salaryMin ? `₹${form.salaryMin} - ₹${form.salaryMax}` : 'Salary undisclosed'}</span>
                     <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm"><Briefcase className="w-4 h-4 text-slate-400" /> {form.jobType}</span>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <h4 className="font-bold text-slate-900 mb-2">Job Description</h4>
                        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">{form.description || 'No description provided.'}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Experience Reqd</p>
                           <p className="text-sm font-semibold text-slate-800 mt-1">{form.experience || 'Not listed'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Education Reqd</p>
                           <p className="text-sm font-semibold text-slate-800 mt-1">{form.education || 'Not listed'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Open Roles</p>
                           <p className="text-sm font-semibold text-slate-800 mt-1">{form.openings || 'Not listed'}</p>
                        </div>
                        {form.gender && form.gender !== 'Any' && (
                           <div>
                              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Gender Reqd</p>
                              <p className="text-sm font-semibold text-slate-800 mt-1">{form.gender}</p>
                           </div>
                        )}
                        {form.ageLimit && (
                           <div>
                              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Age Limit</p>
                              <p className="text-sm font-semibold text-slate-800 mt-1">{form.ageLimit}</p>
                           </div>
                        )}
                     </div>

                     {form.skills && form.skills.length > 0 && (
                       <div>
                          <h4 className="font-bold text-slate-900 mb-3 text-sm">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                             {form.skills.map((s, i) => (
                               <span key={i} className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{s}</span>
                             ))}
                          </div>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 4: PUBLISHING / PAYMENT */}
          {step === 4 && (
            <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Payment & Publishing</h2>

               {/* Draft Status Bonus */}
               <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 mb-6 font-semibold animate-pulse">
                  <Info className="w-5 h-5 shrink-0" />
                  Your draft is saved securely! Finalize details below to push this job into administrative queue.
               </div>

               {hasCredits ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-green-200">
                        <Wallet className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-green-800 mb-2">You have {userCredits} Job {userCredits > 1 ? 'Credits' : 'Credit'} remaining!</h3>
                     <p className="text-green-700 text-[15px] mb-6">Posting this job will gracefully deduct exactly 1 credit from your active balance securely!</p>
                     
                     <button type="button" onClick={submitListing} disabled={submitting} className="btn-primary px-10 py-3 shadow-lg bg-green-600 hover:bg-green-700 border-none transition-transform hover:scale-105 active:scale-95">
                       {submitting ? 'Processing...' : 'Deduct 1 Credit & Publish Job'}
                     </button>
                  </div>
               ) : (
                  <div className="space-y-8 mt-2">
                     <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6 font-semibold">
                        <Info className="w-5 h-5 shrink-0" />
                        You currently have 0 Job Credits. Please purchase a publishing block below!
                     </div>

                     <div>
                        <label className="block text-lg font-bold text-slate-800 mb-5">Select a Pricing Plan</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {PRICING_PLANS.map(plan => (
                              <div 
                                key={plan.id} 
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/20 scale-[1.03]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}
                              >
                                 <h4 className="font-bold text-slate-900 text-lg mb-1">{plan.name}</h4>
                                 <div className="mb-4 text-slate-500">
                                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>{plan.period}
                                 </div>
                                 <div className="h-px w-full bg-slate-200 mb-4"></div>
                                 <ul className="space-y-3 text-sm text-slate-600 font-medium">
                                    {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {f}</li>)}
                                 </ul>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Payment Method UI */}
                     <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl">
                        <label className="block text-lg font-bold text-slate-800 mb-5">Payment Method</label>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                           <button type="button" onClick={() => setPaymentMethod('upi')} className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === 'upi' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                              Pay via UPI
                           </button>
                           <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                              <CreditCard className="w-5 h-5" /> Credit / Debit Card
                           </button>
                        </div>

                        {/* Validated Payment Forms */}
                        {paymentMethod === 'upi' && (
                           <div className="animate-in fade-in slide-in-from-top-2">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Enter UPI ID</label>
                             <input type="text" placeholder="e.g. user@ybl" className="input-field bg-white py-3 text-lg" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                           </div>
                        )}

                        {paymentMethod === 'card' && (
                           <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-2 gap-5">
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Card Number (16 Digits)</label>
                                <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="input-field bg-white font-mono text-lg py-3" value={cardDetails.number} onChange={(e) => setCardDetails(prev => ({...prev, number: e.target.value}))} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Expiry Date (MM/YY)</label>
                                <input type="text" placeholder="12/25" maxLength="5" className="input-field bg-white font-mono text-lg py-3" value={cardDetails.expiry} onChange={(e) => setCardDetails(prev => ({...prev, expiry: e.target.value}))} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">CVV</label>
                                <input type="password" placeholder="123" maxLength="3" className="input-field bg-white font-mono text-lg py-3" value={cardDetails.cvv} onChange={(e) => setCardDetails(prev => ({...prev, cvv: e.target.value}))} />
                             </div>
                           </div>
                        )}
                        
                        {!paymentMethod && <p className="text-sm text-slate-400 italic text-center py-6">Please select a method to proceed.</p>}
                     </div>
                  </div>
               )}
            </div>
          )}

          {/* STEP 5: FINAL SUCCESS NOTIFICATION */}
          {step === 5 && (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <Rocket className="w-12 h-12 text-primary" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-3 text-center">Your job has been submitted successfully!</h2>
               <p className="text-slate-500 text-center max-w-sm mb-10 text-lg">
                  Excellent! Your listing has exited Draft mode and is pending admin approval. It will go live shortly!
               </p>
               <button type="button" onClick={() => navigate('/employer/dashboard')} className="btn-primary px-10 py-3 text-lg rounded-full shadow-md hover:scale-105 transition-transform">
                  Return to Dashboard
               </button>
            </div>
          )}

          {/* Dynamic Footer Controls */}
          {step < 5 && (
             <div className="flex justify-between mt-auto pt-8 border-t border-slate-100">
               {step === 3 && (
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2 px-6">
                    <ChevronLeft className="w-5 h-5" /> Edit Job Details
                  </button>
               )}
               {step > 1 && step < 4 && step !== 3 && !submitting ? (
                  <button type="button" onClick={handleBack} className="btn-secondary flex items-center gap-2 px-6">
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
               ) : step !== 3 ? <div></div> : null}
               
               {step <= 2 ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2 px-8 shadow-md ml-auto hover:scale-105 transition-transform">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
               ) : step === 3 ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2 px-8 shadow-md ml-auto hover:scale-105 transition-transform">
                    Checkout <ChevronRight className="w-5 h-5" />
                  </button>
               ) : step === 4 && !hasCredits ? (
                  <button type="button" onClick={submitListing} disabled={submitting} className="btn-primary px-10 shadow-lg bg-green-600 hover:bg-green-700 border-none ml-auto text-lg py-3 hover:scale-105 transition-transform">
                    {submitting ? 'Processing...' : 'Pay & Publish'}
                  </button>
               ) : null}
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PostJob;
