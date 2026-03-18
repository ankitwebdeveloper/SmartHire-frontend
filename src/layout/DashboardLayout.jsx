import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {

  return (
    <div className="flex bg-[#F8FAFC] min-h-[calc(100vh-80px)]">
      {/* Main Content Centered */}
      <main className="flex-1 w-full py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
