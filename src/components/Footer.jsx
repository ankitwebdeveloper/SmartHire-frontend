import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* SECTION 1 - LOGO */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                SmartHire<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              SmartHire helps candidates discover great roles and helps employers find the right talent—fast, simple, and
              modern.
            </p>
          </div>

          {/* SECTION 2 - LEGAL */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wide uppercase text-sm">Legal</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Terms & Conditions</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* SECTION 3 - SUPPORT */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wide uppercase text-sm">Support</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Help Center</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Contact Support</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Email Support</Link></li>
            </ul>
          </div>

          {/* SECTION 4 - DETAILS */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 tracking-wide uppercase text-sm">Details</h3>
            <div className="space-y-3 text-slate-500 text-sm">
              <p>
                <span className="font-semibold text-slate-700">Address:</span> New Delhi, India
              </p>
              <p>
                <span className="font-semibold text-slate-700">Phone:</span> +91 XXXXX XXXXX
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span> support@smarthire.com
              </p>
            </div>
          </div>

        </div>

       

      </div>
    </footer>
  );
};

export default Footer;
