import React, { useRef, useState } from 'react';
import { Save, UploadCloud } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { formatBytes, isAllowedImageType, readFileAsDataUrl } from '../utils/file';

const EmployerProfile = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { companyLogo, setCompanyLogo } = useAppData();

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const pickLogo = () => {
    setLogoError('');
    fileInputRef.current?.click();
  };

  const handleLogoSelected = async (file) => {
    if (!file) return;
    setLogoError('');
    const maxBytes = 5 * 1024 * 1024;
    if (!isAllowedImageType(file)) {
      setLogoError('Invalid file format. Please upload a PNG or JPG image.');
      return;
    }
    if (file.size > maxBytes) {
      setLogoError('File is too large. Max allowed size is 5MB.');
      return;
    }
    setIsUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCompanyLogo({
        name: file.name,
        type: file.type || '',
        size: file.size,
        dataUrl,
        updatedAtIso: new Date().toISOString(),
      });
    } catch {
      setLogoError('Unable to read this image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-slate-500 mt-1">Manage your company branding and details.</p>
        </div>
      </div>

      <div className="card p-8">
        {isSaved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-center font-medium transition-all">
            🏢 Company profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <input type="text" className="input-field" defaultValue="TechFlow Solutions" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Industry</label>
              <input type="text" className="input-field" defaultValue="Software" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input type="text" className="input-field" defaultValue="Bangalore, India" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Description</label>
              <textarea className="input-field h-32 py-3" defaultValue="We are a leading tech company specializing in React frontend development..."></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <label className="block text-sm font-semibold text-slate-700 mb-3">Upload Company Logo</label>
             <input
               ref={fileInputRef}
               type="file"
               className="hidden"
               accept="image/png,image/jpeg,image/jpg,image/webp"
               onChange={(e) => handleLogoSelected(e.target.files?.[0] || null)}
             />
             <div
               role="button"
               tabIndex={0}
               onClick={pickLogo}
               onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? pickLogo() : null)}
               className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-primary transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/20"
             >
               <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary mb-3" />
               <p className="text-sm text-slate-600 font-medium">{companyLogo ? 'Click to replace logo' : 'Click to upload logo'}</p>
               <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB (Square ratio preferred)</p>
             </div>
             {logoError && (
               <p className="mt-3 text-sm text-red-600 font-medium">{logoError}</p>
             )}
             {isUploading && (
               <p className="mt-3 text-sm text-slate-500 font-medium">Uploading…</p>
             )}
             {companyLogo && !isUploading && (
               <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-xl border border-slate-100 bg-primary flex items-center justify-center overflow-hidden">
                     <img src={companyLogo.dataUrl} alt="Company logo preview" className="w-full h-full object-contain" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-slate-900">{companyLogo.name}</p>
                     <p className="text-xs text-slate-500 mt-1">{formatBytes(companyLogo.size)}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button type="button" className="btn-secondary py-2 px-4 text-sm" onClick={pickLogo}>
                     Replace
                   </button>
                 </div>
               </div>
             )}
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfile;
