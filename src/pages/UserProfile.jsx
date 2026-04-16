import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { isAllowedResumeType, MAX_UPLOAD_BYTES_2MB, formatBytes, readFileAsDataUrl } from '../utils/file';
import { Camera, Mail, Phone, MapPin, Briefcase, Plus, Edit2, Download, UploadCloud, Linkedin, Facebook, Link as LinkIcon, X } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit states
  const [isEditBasic, setIsEditBasic] = useState(false);
  const [isEditExperience, setIsEditExperience] = useState(false);
  const [isEditEducation, setIsEditEducation] = useState(false);
  const [isEditSkills, setIsEditSkills] = useState(false);
  const [isEditSocials, setIsEditSocials] = useState(false);
  
  // Profile Data State
  const [profileData, setProfileData] = useState({
    jobTitle: '',
    bio: '',
    location: '',
    skills: [],
    experience: [],
    education: [],
    socialLinks: { linkedin: '', facebook: '', portfolio: '' }
  });
  
  // Form Draft States (to prevent modifying real state until saved)
  const [draftBasic, setDraftBasic] = useState({ name: '', jobTitle: '' });
  const [draftExperienceText, setDraftExperienceText] = useState('');
  const [draftEducationText, setDraftEducationText] = useState('');
  const [draftSkillsText, setDraftSkillsText] = useState('');
  const [draftSocials, setDraftSocials] = useState({ linkedin: '', facebook: '' });

  const [resumeError, setResumeError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Avatar Upload and Zoom States
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [displayAvatar, setDisplayAvatar] = useState(null);
  const avatarInputRef = useRef(null);
  
  const { user } = useAuth();
  const { candidateResume, setCandidateResume } = useAppData();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await API.get('/profiles/me');
      if (data.profile) {
        setProfileData({ ...data.profile });
        setDisplayAvatar(data.user.avatar);
        
        // Initialize drafts
        setDraftBasic({ name: data.user.name, jobTitle: data.profile.jobTitle || '' });
        setDraftSkillsText((data.profile.skills || []).join(', '));
        setDraftSocials({ 
          linkedin: data.profile.socialLinks?.linkedin || '', 
          facebook: data.profile.socialLinks?.facebook || '' 
        });
        
        // Convert array objects to simple text for the draft boxes
        const expDraft = (data.profile.experience || []).map(e => 
          `${e.startDate ? e.startDate.substring(0,4) : ''} - ${e.endDate ? e.endDate.substring(0,4) : 'Present'}\n${e.position || ''}\n${e.company || ''}\n${e.description || ''}`
        ).join('\n\n');
        setDraftExperienceText(expDraft);

        const eduDraft = (data.profile.education || []).map(e => 
          `${e.startYear || ''} - ${e.endYear || ''}\n${e.degree || ''}\n${e.institution || ''}`
        ).join('\n\n');
        setDraftEducationText(eduDraft);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const { data } = await API.put('/profiles/me', updates);
      setProfileData({ ...data.profile }); // sync real state
      toast.success('Profile updated!');
      setIsEditBasic(false);
      setIsEditExperience(false);
      setIsEditEducation(false);
      setIsEditSkills(false);
      setIsEditSocials(false);
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Failed to update profile');
    }
  };

  const saveBasic = (e) => {
    e.preventDefault();
    handleUpdateProfile({ name: draftBasic.name, jobTitle: draftBasic.jobTitle });
  };

  const saveExperience = (e) => {
    e.preventDefault();
    // basic parsing for demo: split blocks by double newline, grab parts
    const blocks = draftExperienceText.split('\n\n').filter(Boolean);
    const parsedExp = blocks.map(block => {
      const lines = block.split('\n');
      return {
        startDate: lines[0]?.split('-')[0]?.trim() ? new Date(lines[0].split('-')[0].trim(), 0, 1) : null,
        endDate: lines[0]?.split('-')[1]?.trim() === 'Present' ? null : (lines[0]?.split('-')[1]?.trim() ? new Date(lines[0].split('-')[1].trim(), 0, 1) : null),
        position: lines[1] || '',
        company: lines[2] || '',
        description: lines[3] || ''
      };
    });
    handleUpdateProfile({ experience: parsedExp });
  };

  const saveEducation = (e) => {
    e.preventDefault();
    const blocks = draftEducationText.split('\n\n').filter(Boolean);
    const parsedEdu = blocks.map(block => {
      const lines = block.split('\n');
      return {
        startYear: parseInt(lines[0]?.split('-')[0]?.trim()) || null,
        endYear: parseInt(lines[0]?.split('-')[1]?.trim()) || null,
        degree: lines[1] || '',
        institution: lines[2] || ''
      };
    });
    handleUpdateProfile({ education: parsedEdu });
  };

  const saveSkills = (e) => {
    e.preventDefault();
    const skillsArray = draftSkillsText.split(',').map(s => s.trim()).filter(Boolean);
    handleUpdateProfile({ skills: skillsArray });
  };

  const saveSocials = (e) => {
    e.preventDefault();
    handleUpdateProfile({ socialLinks: draftSocials });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsAvatarUploading(true);
    try {
      // 1. Upload to storage
      const { data: uploadData } = await API.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // 2. Save URL to Profile
      await API.put('/profiles/me', { avatar: uploadData.data });
      
      // 3. Update local display
      setDisplayAvatar(uploadData.data);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handlePickResume = () => {
    setResumeError('');
    fileInputRef.current?.click();
  };

  const handleResumeSelected = async (file) => {
    if (!file) return;
    setResumeError('');

    if (!isAllowedResumeType(file)) {
      setResumeError('Invalid file format. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES_2MB) {
      setResumeError('File is too large. Max allowed size is 2MB.');
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCandidateResume({
        name: file.name,
        type: file.type || '',
        size: file.size,
        dataUrl,
        updatedAtIso: new Date().toISOString(),
      });
    } catch {
      setResumeError('Unable to read this file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-4 pb-12">
      
      {/* 1. Top Banner Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-32 bg-primary/10 w-64 absolute -top-10 -left-10 rounded-full blur-3xl opacity-50"></div>
        <div className="p-8 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <div 
              className="w-32 h-32 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => {
                if (displayAvatar || user?.avatar) setIsAvatarZoomed(true);
              }}
            >
              <div className={`absolute inset-0 bg-black/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 ${(displayAvatar || user?.avatar) ? 'flex' : 'hidden'}`}>
                <span className="text-white text-xs font-semibold">View</span>
              </div>
              {displayAvatar || user?.avatar ? (
                <img src={displayAvatar || user?.avatar} alt="Profile" className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <Camera className="w-10 h-10 text-slate-400" />
              )}
            </div>
            
            <input 
              type="file" 
              ref={avatarInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
            
            <button 
              onClick={() => avatarInputRef.current?.click()}
              disabled={isAvatarUploading}
              title="Update Profile Picture"
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow border border-slate-100 text-slate-600 hover:text-primary transition-colors disabled:opacity-50 z-30 flex items-center justify-center"
            >
              {isAvatarUploading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex-1 text-center md:text-left pt-2 w-full">
            <div className="flex items-start justify-between gap-4">
              {isEditBasic ? (
                <form onSubmit={saveBasic} className="space-y-3 w-full max-w-sm">
                  <input type="text" className="input-field" value={draftBasic.name} onChange={e => setDraftBasic({...draftBasic, name: e.target.value})} placeholder="Your Name" required />
                  <input type="text" className="input-field" value={draftBasic.jobTitle} onChange={e => setDraftBasic({...draftBasic, jobTitle: e.target.value})} placeholder="Professional Title (e.g. Senior UX Researcher)" />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary py-2 px-4 text-sm flex-1">Save</button>
                    <button type="button" onClick={() => setIsEditBasic(false)} className="btn-secondary py-2 px-4 text-sm flex-1">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                    <p className="text-xl text-slate-600 font-medium mt-1">{profileData?.jobTitle || 'Add Professional Title'}</p>
                  </div>
                  <button onClick={() => setIsEditBasic(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Experience & Education) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Experience Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Experience</h2>
              <button onClick={() => setIsEditExperience(!isEditExperience)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            {isEditExperience ? (
              <form onSubmit={saveExperience} className="space-y-4">
                 <textarea 
                   className="input-field h-40 py-3" 
                   value={draftExperienceText}
                   onChange={e => setDraftExperienceText(e.target.value)}
                   placeholder="Format for each job (separate jobs with blank line):&#10;2018 - Present&#10;Job Title&#10;Company Name&#10;Description..." 
                 />
                 <div className="flex justify-end gap-2">
                   <button type="button" onClick={() => setIsEditExperience(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                   <button type="submit" className="btn-primary py-2 px-4 text-sm">Save</button>
                 </div>
              </form>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-[70px] sm:ml-20 space-y-8">
                {profileData?.experience && profileData.experience.length > 0 ? profileData.experience.map((exp, idx) => {
                  const startYear = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
                  const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present';
                  return (
                    <div key={idx} className="relative pl-6">
                      <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white"></span>
                      <span className="absolute -left-[70px] sm:-left-20 text-slate-500 font-medium text-sm top-0.5">{startYear} -</span>
                      <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                      <p className="text-slate-600 font-medium text-sm mt-0.5 mb-2">{exp.company}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  );
                }) : (
                  <p className="text-slate-500 italic pl-6">No experience added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Education Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Education</h2>
              <button onClick={() => setIsEditEducation(!isEditEducation)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            {isEditEducation ? (
               <form onSubmit={saveEducation} className="space-y-4">
                 <textarea 
                   className="input-field h-40 py-3" 
                   value={draftEducationText}
                   onChange={e => setDraftEducationText(e.target.value)}
                   placeholder="Format for each degree (separate degrees with blank line):&#10;2015 - 2019&#10;Degree Name&#10;Institution Name" 
                 />
                 <div className="flex justify-end gap-2">
                   <button type="button" onClick={() => setIsEditEducation(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                   <button type="submit" className="btn-primary py-2 px-4 text-sm">Save</button>
                 </div>
              </form>
            ) : (
              <div className="space-y-6">
                {profileData?.education && profileData.education.length > 0 ? profileData.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="text-slate-500 font-medium text-sm w-12 shrink-0 pt-0.5">{edu.startYear || ''} -<br/>{edu.endYear || 'Present'}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">{edu.degree}</h3>
                      <p className="text-slate-600 text-sm mt-1">{edu.institution}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 italic">No education history added yet.</p>
                )}
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column (Skills, Resume, Socials) */}
        <div className="space-y-6">
          
          {/* Skills Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">Skills</h2>
              <button onClick={() => setIsEditSkills(!isEditSkills)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            {isEditSkills ? (
               <form onSubmit={saveSkills} className="space-y-4">
                 <input 
                   type="text" 
                   className="input-field" 
                   value={draftSkillsText}
                   onChange={e => setDraftSkillsText(e.target.value)}
                   placeholder="React, Node.js, Design..." 
                 />
                 <p className="text-xs text-slate-500">Comma separated skills.</p>
                 <div className="flex justify-end gap-2">
                   <button type="button" onClick={() => setIsEditSkills(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                   <button type="submit" className="btn-primary py-2 px-4 text-sm">Save</button>
                 </div>
               </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData?.skills && profileData.skills.length > 0 ? profileData.skills.map((skill, i) => (
                  <span key={i} className="bg-primary text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                    {skill}
                  </span>
                )) : (
                  <span className="text-slate-500 text-sm italic">No skills added yet.</span>
                )}
              </div>
            )}
          </div>

          {/* Resume Upload Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-5">Resume Upload</h2>
            
             <input
               ref={fileInputRef}
               type="file"
               className="hidden"
               accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               onChange={(e) => handleResumeSelected(e.target.files?.[0] || null)}
             />
             <div
               role="button"
               tabIndex={0}
               onClick={handlePickResume}
               onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handlePickResume() : null)}
               className="border-2 border-dashed border-slate-200 bg-primary rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-primary hover:border-primary transition-colors cursor-pointer group focus:outline-none"
             >
               <UploadCloud className="w-8 h-8 text-primary mb-3" />
               <p className="text-sm text-slate-600 font-medium text-center">
                 {candidateResume ? 'Replace Resume' : 'Drag and drop\nin text here'}
               </p>
             </div>
             {resumeError && (
               <p className="mt-3 text-sm text-red-600 font-medium text-center">{resumeError}</p>
             )}
             {isUploading && (
               <p className="mt-3 text-sm text-slate-500 font-medium text-center">Uploading…</p>
             )}
             {candidateResume && !isUploading && (
               <div className="mt-4 flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                 <div className="truncate pr-2 text-sm font-medium text-slate-800">
                   {candidateResume.name}
                 </div>
                 <a href={candidateResume.dataUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-primary bg-primary p-1.5 rounded-lg">
                   <Download className="w-4 h-4" />
                 </a>
               </div>
             )}
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">Social Links</h2>
              <button onClick={() => setIsEditSocials(!isEditSocials)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            {isEditSocials ? (
               <form onSubmit={saveSocials} className="space-y-4">
                 <input type="text" className="input-field" value={draftSocials.facebook} onChange={e => setDraftSocials({...draftSocials, facebook: e.target.value})} placeholder="Facebook URL" />
                 <input type="text" className="input-field" value={draftSocials.linkedin} onChange={e => setDraftSocials({...draftSocials, linkedin: e.target.value})} placeholder="LinkedIn URL" />
                 <div className="flex justify-end gap-2">
                   <button type="button" onClick={() => setIsEditSocials(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                   <button type="submit" className="btn-primary py-2 px-4 text-sm">Save</button>
                 </div>
               </form>
            ) : (
              <div className="space-y-4">
                <a href={profileData?.socialLinks?.facebook || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-700 pb-3 border-b border-slate-100 hover:text-primary transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">{profileData?.socialLinks?.facebook ? 'Facebook' : 'Add Facebook'}</span>
                </a>
                <a href={profileData?.socialLinks?.linkedin || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-700 pb-3 border-b border-slate-100 hover:text-primary transition-colors cursor-pointer">
                  <Linkedin className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">{profileData?.socialLinks?.linkedin ? 'LinkedIn' : 'Add LinkedIn'}</span>
                </a>
                <div className="flex items-center gap-3 text-slate-700 pb-1 hover:text-primary transition-colors cursor-pointer disabled">
                  <LinkIcon className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-sm">Manage Links</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Zoom Modal */}
      {isAvatarZoomed && (displayAvatar || user?.avatar) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setIsAvatarZoomed(false)}>
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); setIsAvatarZoomed(false); }}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={displayAvatar || user?.avatar} 
            alt="Zoomed Profile" 
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl transition-transform duration-300 cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
};

export default UserProfile;
