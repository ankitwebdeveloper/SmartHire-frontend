import React from 'react';
import { Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const Notification = () => {
  const { notifications, markAllNotificationsRead } = useAppData();

  const metaByType = {
    success: { icon: CheckCircle, iconColor: 'text-green-600', bgColor: 'bg-green-50' },
    info: { icon: Bell, iconColor: 'text-primary', bgColor: 'bg-primary' },
    warning: { icon: Clock, iconColor: 'text-orange-600', bgColor: 'bg-orange-50' },
    error: { icon: XCircle, iconColor: 'text-red-600', bgColor: 'bg-red-50' },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated on your job applications and alerts.</p>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="text-sm font-semibold text-primary hover:text-primary"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((note) => {
          const meta = metaByType[note.type] || metaByType.info;
          const Icon = meta.icon;
          return (
            <div 
              key={note.id} 
              className={`card p-5 flex items-start gap-4 transition-all hover:shadow-md ${note.unread ? 'border-primary/30 bg-primary/5' : 'border-slate-100 bg-white'}`}
            >
              <div className={`p-3 rounded-full shrink-0 ${meta.bgColor}`}>
                <Icon className={`w-6 h-6 ${meta.iconColor}`} />
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                  <h3 className={`text-base font-bold ${note.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {note.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {note.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 sm:line-clamp-none">
                  {note.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
