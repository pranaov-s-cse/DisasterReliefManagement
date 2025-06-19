import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Home, 
  AlertOctagon, 
  Package2, 
  Users, 
  Map, 
  UserCircle,
  X,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">TN-DMS</h2>
                <p className="text-xs text-gray-500">Disaster Management System</p>
              </div>
            </div>
            
            {/* Close button on mobile */}
            <button 
              onClick={closeSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Sidebar content */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0" />
              Dashboard
            </NavLink>
            
            <NavLink
              to="/alerts"
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <AlertOctagon className="mr-3 h-5 w-5 flex-shrink-0" />
              Disaster Alerts
            </NavLink>
            
            <NavLink
              to={isAdmin ? "/admin/resources" : "/resources"}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Package2 className="mr-3 h-5 w-5 flex-shrink-0" />
              Resources
            </NavLink>
            
            <NavLink
              to={isAdmin ? "/admin/volunteers" : "/volunteers"}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Users className="mr-3 h-5 w-5 flex-shrink-0" />
              Volunteers
            </NavLink>
            
            <NavLink
              to="/map"
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Map className="mr-3 h-5 w-5 flex-shrink-0" />
              Geospatial Map
            </NavLink>
            
            <NavLink
              to="/profile"
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <UserCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              My Profile
            </NavLink>
          </nav>
          
          {/* User info and logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-700 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150 ease-in-out"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;