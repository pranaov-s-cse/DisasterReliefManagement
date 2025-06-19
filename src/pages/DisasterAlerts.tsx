import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Filter, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  XCircle,
  Info,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { DisasterAlert, DisasterType, SeverityLevel } from '../types/disaster';
import { mockDisasters } from '../data/mockDisasters';
import { mockSocket } from '../utils/mockSocket';
import { useAuth } from '../contexts/AuthContext';

const DisasterAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<DisasterAlert[]>(mockDisasters);
  const [filteredAlerts, setFilteredAlerts] = useState<DisasterAlert[]>(mockDisasters);
  const [subscriptions, setSubscriptions] = useState<{
    types: DisasterType[];
    districts: string[];
    severity: SeverityLevel[];
  }>({
    types: [],
    districts: user?.location?.district ? [user.location.district] : [],
    severity: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock disaster types for filtering
  const disasterTypes: DisasterType[] = ['flood', 'cyclone', 'earthquake', 'tsunami', 'fire', 'landslide', 'drought', 'heatwave'];
  
  // Mock severity levels for filtering
  const severityLevels: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
  
  // Mock districts from Tamil Nadu
  const districts = Array.from(new Set(mockDisasters.map(d => d.location.district)));
  
  // Listen for real-time alerts
  useEffect(() => {
    const handleNewAlert = (alert: DisasterAlert) => {
      setAlerts(prev => [alert, ...prev]);
    };
    
    mockSocket.on('new-alert', handleNewAlert);
    
    return () => {
      mockSocket.off('new-alert', handleNewAlert);
    };
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = alerts;
    
    if (subscriptions.types.length > 0) {
      filtered = filtered.filter(alert => subscriptions.types.includes(alert.type));
    }
    
    if (subscriptions.districts.length > 0) {
      filtered = filtered.filter(alert => 
        subscriptions.districts.includes(alert.location.district) || 
        alert.affectedAreas.some(area => subscriptions.districts.includes(area))
      );
    }
    
    if (subscriptions.severity.length > 0) {
      filtered = filtered.filter(alert => subscriptions.severity.includes(alert.severity));
    }
    
    setFilteredAlerts(filtered);
  }, [alerts, subscriptions]);
  
  // Toggle filter selection
  const toggleFilter = (type: 'types' | 'districts' | 'severity', value: string) => {
    setSubscriptions(prev => {
      const current = prev[type] as string[];
      const updated = current.includes(value as never) 
        ? current.filter(v => v !== value)
        : [...current, value as never];
      
      return {
        ...prev,
        [type]: updated,
      };
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSubscriptions({
      types: [],
      districts: [],
      severity: [],
    });
  };
  
  // Get severity class for visual styling
  const getSeverityClass = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return 'bg-error-600';
      case 'high':
        return 'bg-warning-500';
      case 'medium':
        return 'bg-accent-400';
      case 'low':
        return 'bg-secondary-600';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Disaster Alerts</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="mt-5 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Filter Alerts</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Clear all filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Disaster types */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Disaster Type</h4>
                <div className="space-y-2">
                  {disasterTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={subscriptions.types.includes(type)}
                        onChange={() => toggleFilter('types', type)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Districts */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Districts</h4>
                <div className="space-y-2">
                  {districts.map((district) => (
                    <label key={district} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={subscriptions.districts.includes(district)}
                        onChange={() => toggleFilter('districts', district)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{district}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Severity */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Severity</h4>
                <div className="space-y-2">
                  {severityLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={subscriptions.severity.includes(level)}
                        onChange={() => toggleFilter('severity', level)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Alert if no results */}
        {filteredAlerts.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">No alerts found</h3>
                <p className="mt-1 text-sm text-yellow-700">There are no disaster alerts matching your filter criteria. Try adjusting your filters or check back later.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Alerts list */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className="transform transition duration-100 hover:shadow-md">
              <div>
                <div className="flex items-start space-x-4">
                  <div className={`${getSeverityClass(alert.severity)} p-2 rounded-lg`}>
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 capitalize">{alert.type} - {alert.severity} severity</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-base text-gray-700">{alert.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        {alert.location.district}
                      </div>
                      
                      {alert.affectedAreas.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Affected Areas: </span>
                          {alert.affectedAreas.join(', ')}
                        </div>
                      )}
                    </div>
                    
                    {/* Resources needed */}
                    {alert.resources && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Resources</h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {alert.resources.required.map((resource, index) => (
                            <span 
                              key={index}
                              className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${alert.resources?.available.includes(resource) 
                                  ? 'bg-success-100 text-success-800' 
                                  : 'bg-error-100 text-error-800'}
                              `}
                            >
                              {resource}
                              {!alert.resources?.available.includes(resource) && (
                                <XCircle className="ml-1 h-3 w-3" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Updates */}
                    {alert.updates && alert.updates.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Latest Updates</h4>
                        <div className="mt-1 space-y-2">
                          {alert.updates.slice(0, 2).map((update, index) => (
                            <div key={index} className="flex items-start text-sm">
                              <Info className="h-4 w-4 text-secondary-600 mr-2 mt-0.5" />
                              <div>
                                <p className="text-gray-700">{update.content}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(update.timestamp), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="mt-4 flex space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setShowModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed View Modal */}
        {showModal && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAlert.title}</h2>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityClass(selectedAlert.severity)} text-white`}>
                        {selectedAlert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(selectedAlert.timestamp), 'PPpp')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <p className="text-gray-700">{selectedAlert.description}</p>
                </div>

                {/* Location and Affected Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Location Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{selectedAlert.location.district}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                        <span>Affected Areas: {selectedAlert.affectedAreas.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Resource Status</h3>
                    <div className="space-y-2">
                      {selectedAlert.resources?.required.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{resource}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedAlert.resources?.available.includes(resource)
                              ? 'bg-success-100 text-success-800'
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {selectedAlert.resources?.available.includes(resource) ? 'Available' : 'Needed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Updates Timeline */}
                {selectedAlert.updates && selectedAlert.updates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Latest Updates</h3>
                    <div className="space-y-4">
                      {selectedAlert.updates.map((update, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-700">{update.content}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(update.timestamp), 'PPp')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {selectedAlert.healthAdvisory && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Health Advisory</h3>
                        <p className="mt-1 text-sm text-yellow-700">{selectedAlert.healthAdvisory}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contacts */}
                {selectedAlert.emergencyContacts && selectedAlert.emergencyContacts.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-error-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
                      <div className="mt-2 space-y-2">
                        {selectedAlert.emergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Info className="h-4 w-4 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <span>{contact.department}: </span>
                              <span>{contact.number}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterAlerts;