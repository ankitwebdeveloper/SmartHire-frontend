import React from 'react';
import { Code, PenTool, LayoutTemplate, Megaphone, Presentation, Headphones, Database, BarChart } from 'lucide-react';

const CategoryCard = ({ title, openPositions, iconType, bgColorClass, textColorClass }) => {
  
  // Quick map to render a specific Icon based on string type
  const renderIcon = () => {
    switch (iconType) {
      case 'code': return <Code className="w-8 h-8" />;
      case 'design': return <PenTool className="w-8 h-8" />;
      case 'marketing': return <Megaphone className="w-8 h-8" />;
      case 'business': return <Presentation className="w-8 h-8" />;
      case 'support': return <Headphones className="w-8 h-8" />;
      case 'data': return <Database className="w-8 h-8" />;
      case 'analytics': return <BarChart className="w-8 h-8" />;
      default: return <LayoutTemplate className="w-8 h-8" />;
    }
  };

  return (
    <div className="card p-6 flex items-center gap-5 cursor-pointer group hover:border-primary/20">
      
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300 ${bgColorClass} ${textColorClass}`}>
        {renderIcon()}
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          {openPositions} Open Positions
        </p>
      </div>

    </div>
  );
};

export default CategoryCard;
