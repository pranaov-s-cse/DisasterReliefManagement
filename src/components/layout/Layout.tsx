import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import { Bell } from 'lucide-react';
import { mockSocket } from '../../utils/mockSocket';
import { DisasterAlert } from '../../types/disaster';
import toast from 'react-hot-toast';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  
  // Setup socket listeners for real-time alerts
  useState(() => {
    // Listen for new alerts
    const handleNewAlert = (alert: DisasterAlert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5)); // Keep only the 5 most recent alerts
      
      // Show toast notification for new alert
      toast((t) => (
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-error-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold">{alert.title}</p>
            <p className="text-sm text-gray-600">{alert.description.substring(0, 100)}...</p>
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          borderLeft: '4px solid #C62828',
        },
      });
    };
    
    mockSocket.on('new-alert', handleNewAlert);
    
    // Cleanup
    return () => {
      mockSocket.off('new-alert', handleNewAlert);
    };
  });
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Topbar openSidebar={() => setSidebarOpen(true)} alerts={alerts} />
        
        <main className="flex-1 overflow-auto bg-gray-50 py-6">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;