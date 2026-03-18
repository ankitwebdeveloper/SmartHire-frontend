import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  return (
    <div className="card p-6 flex items-center justify-center text-center group cursor-pointer hover:border-primary/20 transition-all h-32">
      <div className="w-full h-full flex items-center justify-center">
        <img src={company.logo} alt={company.name} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </div>
  );
};

export default CompanyCard;
