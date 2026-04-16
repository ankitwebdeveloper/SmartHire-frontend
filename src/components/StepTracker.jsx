import React from 'react';

const StepTracker = ({ steps, currentIndex = 0 }) => {
  const safeCurrent = Math.max(0, Math.min(currentIndex, steps.length - 1));

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
        {steps.map((label, idx) => {
          const isCompleted = idx < safeCurrent;
          const isCurrent = idx === safeCurrent;
          const dotClass = isCompleted
            ? 'bg-primary border-primary'
            : isCurrent
              ? 'bg-white border-primary'
              : 'bg-white border-slate-200';
          const textClass = isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400';
          const lineClass = idx < safeCurrent ? 'bg-primary' : 'bg-primary';

          return (
            <div key={`${label}_${idx}`} className="flex items-center">
              <div className="flex flex-col items-center min-w-[92px]">
                <div className={`w-8 h-8 rounded-full border-2 ${dotClass} flex items-center justify-center`}>
                  <span className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-primary'}`}>
                    {idx + 1}
                  </span>
                </div>
                <span className={`mt-2 text-xs font-semibold text-center ${textClass}`}>{label}</span>
              </div>
              {idx !== steps.length - 1 && (
                <div className="mx-2 sm:mx-3 h-1 w-10 sm:w-14 rounded-full shrink-0">
                  <div className={`h-1 w-full rounded-full ${lineClass}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepTracker;

