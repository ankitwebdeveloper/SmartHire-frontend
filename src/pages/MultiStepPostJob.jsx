import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Building2, MapPin, DollarSign, Briefcase } from 'lucide-react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Job Details' },
  { id: 2, title: 'Requirements' },
  { id: 3, title: 'Preview' },
  { id: 4, title: 'Publishing' }
];

const PRICING_PLANS = [
  { id: 'basic', name: 'Basic Tier', price: '$29', features: ['Standard listing for 30 days', 'Standard support'] },
  { id: 'pro', name: 'Pro Tier', price: '$99', features: ['Highlighted listing', 'Social media promotion', 'Lasts 60 days'] },
  { id: 'elite', name: 'Elite Tier', price: '$199', features: ['Top of search results', 'Dedicated account manager', 'Lasts 90 days'] }
];

const MultiStepPostJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Core Form Data
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    category: '',
    description: '',
    skills: '', // comma separated string
    experience: '',
    education: ''
  });

  // Mock Payment Data
  const [hasActivePlan] = useState(false); // Simulating no active plan
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'upi' or 'card'
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const onChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  // Final Submit Handler
  const submitListing = async (e) => {
    e?.preventDefault();
    
    // UI Validation for mock payment
    if (!hasActivePlan && step === 4) {
       if (!paymentMethod) return toast.error('Please select a payment method.');
       if (paymentMethod === 'upi' && !upiId.trim()) return toast.error('Please enter a valid UPI ID.');
       if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
         return toast.error('Please fill out all Credit Card details.');
       }
    }

    setSubmitting(true);
    try {
      // Transforming our local multi-step form to match the generic backend payload expectations
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        salary: form.salary, // The payload historically takes salary range string
        jobType: form.jobType,
        category: form.category,
        experience: form.experience, // Mapped generic
        description: `Requirements:\n- Education: ${form.education}\n- Skills: ${form.skills}\n\n${form.description}` 
      };

      const res = await API.post('/jobs', payload);
      toast.success(res.data?.message || 'Job submitted and payment processed securely! Pending admin approval.');
      navigate('/employer/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Advanced Job Publisher</h1>
        <p className="text-slate-500 mt-1">Complete the steps below to craft the perfect job listing.</p>
      </div>

      {/* Stepper Progress UI */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, index) => (
          <div key={s.id} className="flex-1 flex items-center">
             <div className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s.id ? 'bg-primary border-primary text-white shadow-md' : 'border-slate-200 bg-slate-50'}`}>
                   {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{s.title}</span>
             </div>
             {index !== STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step > s.id ? 'bg-primary' : 'bg-slate-200'}`}></div>
             )}
          </div>
        ))}
      </div>

      {/* Main Card Content */}
      <div className="card p-8 min-h-[500px] flex flex-col shadow-sm border border-slate-100">
        
        {/* STEP 1: JOB DETAILS */}
        {step === 1 && (
          <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">1. General Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                <input type="text" placeholder="e.g. Senior Frontend Engineer" className="input-field" value={form.title} onChange={onChange('title')} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                <input type="text" placeholder="e.g. SmartHire Tech" className="input-field" value={form.company} onChange={onChange('company')} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input type="text" placeholder="e.g. New York or Remote" className="input-field" value={form.location} onChange={onChange('location')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Category</label>
                <input type="text" placeholder="e.g. Engineering, Marketing..." className="input-field" value={form.category} onChange={onChange('category')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                <select className="input-field" value={form.jobType} onChange={onChange('jobType')}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
                <input type="text" placeholder="e.g. $100k - $120k" className="input-field" value={form.salary} onChange={onChange('salary')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description *</label>
                <textarea rows="5" placeholder="Briefly describe the day-to-day responsibilities..." className="input-field resize-none" value={form.description} onChange={onChange('description')} required />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REQUIREMENTS */}
        {step === 2 && (
          <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">2. Candidate Requirements</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level</label>
                <input type="text" placeholder="e.g. 3-5 Years, Mid-level" className="input-field" value={form.experience} onChange={onChange('experience')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Required Education</label>
                <input type="text" placeholder="e.g. Bachelor's in CS, High School, etc." className="input-field" value={form.education} onChange={onChange('education')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Key Skills (Comma separated)</label>
                <textarea rows="3" placeholder="e.g. React, Node.js, MongoDB, Figma..." className="input-field resize-none" value={form.skills} onChange={onChange('skills')} />
                <p className="text-xs text-slate-500 mt-2">These will automatically be parsed into readable badges on your final listing.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 3 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 mx-auto w-full max-w-3xl">
             <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">3. Preview Your Listing</h2>
             
             {/* Preview Card styled closely to our official JobDetails header styling */}
             <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 relative pointer-events-none shadow-sm">
                <div className="flex gap-4 items-center mb-6 border-b border-slate-200 pb-6">
                   <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-3 shrink-0">
                      <Building2 className="w-8 h-8 text-slate-300" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-slate-900">{form.title || 'Untitled Job Role'}</h3>
                     <p className="text-primary font-semibold">{form.company || 'Company Name'}</p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-600 font-medium">
                   <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200"><MapPin className="w-4 h-4 text-slate-400" /> {form.location || 'Location missing'}</span>
                   <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200"><DollarSign className="w-4 h-4 text-slate-400" /> {form.salary || 'Salary undisclosed'}</span>
                   <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-slate-200"><Briefcase className="w-4 h-4 text-slate-400" /> {form.jobType}</span>
                </div>

                <div className="space-y-4">
                   <div>
                      <h4 className="font-bold text-slate-900 mb-2 text-sm">About the Role</h4>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{form.description || 'Description goes here...'}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200">
                      <div>
                         <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Experience Reqd</p>
                         <p className="text-sm font-semibold text-slate-800">{form.experience || 'None listed'}</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Education Reqd</p>
                         <p className="text-sm font-semibold text-slate-800">{form.education || 'None listed'}</p>
                      </div>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 mb-2 text-sm">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                         {form.skills ? form.skills.split(',').map((s, i) => (
                           <span key={i} className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full">{s.trim()}</span>
                         )) : <span className="text-sm text-slate-400 italic">No skills listed</span>}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* STEP 4: PUBLISHING / PAYMENT */}
        {step === 4 && (
          <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">4. Payment & Publishing</h2>
             
             {hasActivePlan ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                   <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold text-green-800 mb-2">Active Subscription Found!</h3>
                   <p className="text-green-700 text-sm">Your account has an active premium plan. You can bypass the payment portal and publish your job immediately.</p>
                </div>
             ) : (
                <div className="space-y-8">
                   {/* Plan Selection */}
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-4">Select a Publishing Tier</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {PRICING_PLANS.map(plan => (
                            <div 
                              key={plan.id} 
                              onClick={() => setSelectedPlan(plan.id)}
                              className={`cursor-pointer rounded-xl p-5 border-2 transition-all ${selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                               <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold text-slate-900">{plan.name}</h4>
                                  <span className="text-lg font-black text-primary">{plan.price}</span>
                               </div>
                               <ul className="space-y-2 text-xs text-slate-600 font-medium">
                                  {plan.features.map((f, i) => <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {f}</li>)}
                               </ul>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Payment Method UI Logic */}
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-4">Payment Method</label>
                      <div className="flex gap-4 mb-6">
                         <button type="button" onClick={() => setPaymentMethod('upi')} className={`flex-1 py-3 rounded-lg border font-bold transition-colors ${paymentMethod === 'upi' ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                            Pay via UPI
                         </button>
                         <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-lg border font-bold transition-colors flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-slate-900 border-black text-white shadow-md' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                            <CreditCard className="w-5 h-5" /> Credit/Debit Card
                         </button>
                      </div>

                      {/* Mock Forms depending on method */}
                      {paymentMethod === 'upi' && (
                         <div className="animate-in fade-in slide-in-from-top-2">
                           <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Enter UPI ID</label>
                           <input type="text" placeholder="e.g. yourname@okbank" className="input-field bg-white" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                         </div>
                      )}

                      {paymentMethod === 'card' && (
                         <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-2 gap-4">
                           <div className="col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Card Number</label>
                              <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" className="input-field bg-white" value={cardDetails.number} onChange={(e) => setCardDetails(prev => ({...prev, number: e.target.value}))} />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Expiry (MM/YY)</label>
                              <input type="text" placeholder="MM/YY" maxLength="5" className="input-field bg-white" value={cardDetails.expiry} onChange={(e) => setCardDetails(prev => ({...prev, expiry: e.target.value}))} />
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">CVV</label>
                              <input type="password" placeholder="123" maxLength="4" className="input-field bg-white" value={cardDetails.cvv} onChange={(e) => setCardDetails(prev => ({...prev, cvv: e.target.value}))} />
                           </div>
                         </div>
                      )}
                      
                      {!paymentMethod && <p className="text-sm text-slate-400 italic text-center py-4">Please select a payment method to proceed.</p>}
                   </div>
                </div>
             )}
          </div>
        )}

        {/* Footer Navigation Checks */}
        <div className="flex justify-between mt-auto pt-8 border-t border-slate-100">
          <button type="button" onClick={handleBack} disabled={step === 1 || submitting} className="btn-secondary flex items-center gap-2 px-6">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          {step < 4 ? (
             <button type="button" onClick={handleNext} disabled={!form.title || !form.company || !form.description} className="btn-primary flex items-center gap-2 px-8 shadow-md">
               Next Step <ChevronRight className="w-5 h-5" />
             </button>
          ) : (
             <button type="button" onClick={submitListing} disabled={submitting} className="btn-primary px-10 shadow-lg bg-green-600 hover:bg-green-700 border-none">
               {submitting ? 'Processing...' : 'Pay & Publish Listing'}
             </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default MultiStepPostJob;
