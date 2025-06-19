import { useState } from 'react';
import { Bell, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DisasterAlert } from '../../types/disaster';
import { format } from 'date-fns';

interface TopbarProps {
  openSidebar: () => void;
  alerts: DisasterAlert[];
}

const Topbar = ({ openSidebar, alerts }: TopbarProps) => {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };
  
  return (
    <header className="z-10 py-4 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={openSidebar}
          className="lg:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 p-1 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 flex justify-between items-center">
          {/* Title - visible on larger screens */}
          <h1 className="hidden md:block text-xl font-bold text-gray-800">
            Tamil Nadu Disaster Management System
          </h1>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {alerts.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-600 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-2 divide-y divide-gray-100">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 flex justify-between items-center">
                      Recent Alerts
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {alerts.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No new alerts
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div key={alert.id} className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className={`h-2 w-2 mt-1.5 rounded-full flex-shrink-0 mr-2 ${
                              alert.severity === 'critical' ? 'bg-error-600' : 
                              alert.severity === 'high' ? 'bg-warning-500' : 
                              alert.severity === 'medium' ? 'bg-accent-400' : 'bg-secondary-600'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {alert.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <div className="px-4 py-2 text-xs text-center">
                      <a href="/alerts" className="text-primary-600 hover:text-primary-800 font-medium">
                        View all alerts
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* User info - visible on larger screens */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-700 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-700">{user?.name}</span>
                <span className="text-xs text-gray-500 ml-1">({user?.role})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;