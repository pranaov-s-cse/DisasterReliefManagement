import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Users, 
  PackageOpen, 
  MapPin,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Card from '../components/ui/Card';
import { mockDisasters } from '../data/mockDisasters';
import { mockResources } from '../data/mockResources';
import { getAvailableVolunteers } from '../data/mockVolunteers';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeDisasters, setActiveDisasters] = useState(mockDisasters.slice(0, 3));
  const [resourceStats, setResourceStats] = useState({
    totalFood: 0,
    totalWater: 0,
    totalMedical: 0,
    totalShelter: 0,
  });
  const [availableVolunteers, setAvailableVolunteers] = useState(0);
  
  useEffect(() => {
    // Calculate resource statistics
    const food = mockResources.filter(r => r.category === 'food').reduce((acc, curr) => acc + curr.quantity, 0);
    const water = mockResources.filter(r => r.category === 'water').reduce((acc, curr) => acc + curr.quantity, 0);
    const medical = mockResources.filter(r => r.category === 'medical').reduce((acc, curr) => acc + curr.quantity, 0);
    const shelter = mockResources.filter(r => r.category === 'shelter').reduce((acc, curr) => acc + curr.quantity, 0);
    
    setResourceStats({
      totalFood: food,
      totalWater: water,
      totalMedical: medical,
      totalShelter: shelter,
    });
    
    // Count available volunteers
    setAvailableVolunteers(getAvailableVolunteers().length);
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
            Welcome back, {user?.name}
          </h2>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Tamil Nadu Disaster Management System Dashboard
          </p>
        </div>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active disasters */}
            <div className="bg-primary-50 rounded-lg p-5 border border-primary-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-10 w-10 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary-800 truncate">
                      Active Disasters
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-primary-900">
                        {activeDisasters.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            {/* Available volunteers */}
            <div className="bg-secondary-50 rounded-lg p-5 border border-secondary-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 text-secondary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-800 truncate">
                      Available Volunteers
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900">
                        {availableVolunteers}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            {/* Food resources */}
            <div className="bg-success-50 rounded-lg p-5 border border-success-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PackageOpen className="h-10 w-10 text-success-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-success-800 truncate">
                      Food Resources
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-success-900">
                        {resourceStats.totalFood} kg
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            {/* Water resources */}
            <div className="bg-accent-50 rounded-lg p-5 border border-accent-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PackageOpen className="h-10 w-10 text-accent-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-accent-800 truncate">
                      Water Resources
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-accent-900">
                        {resourceStats.totalWater} bottles
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active disasters */}
      <Card 
        title="Active Disasters" 
        footer={
          <Link to="/alerts" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center">
            View all alerts
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        }
      >
        <div className="space-y-4">
          {activeDisasters.length > 0 ? (
            activeDisasters.map((disaster) => (
              <div 
                key={disaster.id} 
                className={`
                  rounded-md border px-4 py-3 flex items-start space-x-3
                  ${disaster.severity === 'critical' ? 'border-error-300 bg-error-50' : 
                    disaster.severity === 'high' ? 'border-warning-300 bg-warning-50' : 
                    disaster.severity === 'medium' ? 'border-accent-300 bg-accent-50' : 
                    'border-secondary-300 bg-secondary-50'}
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <ShieldAlert className={`
                    h-5 w-5
                    ${disaster.severity === 'critical' ? 'text-error-600' : 
                      disaster.severity === 'high' ? 'text-warning-500' : 
                      disaster.severity === 'medium' ? 'text-accent-400' : 
                      'text-secondary-600'}
                  `} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {disaster.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(disaster.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {disaster.description}
                  </p>
                  <div className="mt-2 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">
                      {disaster.location.district} | {disaster.affectedAreas.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No active disasters at the moment.</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Quick actions section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Resources">
          <p className="text-sm text-gray-600 mb-4">
            Manage disaster relief resources and supplies
          </p>
          <div className="space-y-2">
            <Link 
              to="/resources" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              View available resources
            </Link>
            <Link 
              to="/resources?action=donate" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              Donate resources
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin/resources" 
                className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
              >
                Manage resource inventory
              </Link>
            )}
          </div>
        </Card>
        
        <Card title="Volunteer">
          <p className="text-sm text-gray-600 mb-4">
            Join volunteer efforts for disaster response
          </p>
          <div className="space-y-2">
            <Link 
              to="/volunteers" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              View volunteer opportunities
            </Link>
            <Link 
              to="/volunteers?action=register" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              Register as a volunteer
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin/volunteers" 
                className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
              >
                Manage volunteers
              </Link>
            )}
          </div>
        </Card>
        
        <Card title="Geospatial Map">
          <p className="text-sm text-gray-600 mb-4">
            View disaster zones and safe areas on an interactive map
          </p>
          <div className="space-y-2">
            <Link 
              to="/map" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              View disaster map
            </Link>
            <Link 
              to="/map?mode=report" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              Report an incident
            </Link>
            <Link 
              to="/map?view=shelters" 
              className="block text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 px-3 py-2 rounded-md transition-colors"
            >
              Find nearby shelters
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;