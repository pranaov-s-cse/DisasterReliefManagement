import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Plus, 
  Home,
  FileWarning
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, useMap } from 'react-leaflet';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockDisasters } from '../data/mockDisasters';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DisasterAlert, DisasterType } from '../types/disaster';
import { format } from 'date-fns';

// This is for the map recenter functionality
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

// Mock shelter data
const shelters = [
  { id: '1', name: 'Government School, Chennai', coordinates: [13.0827, 80.2707], capacity: 500, available: true },
  { id: '2', name: 'Community Center, Coimbatore', coordinates: [11.0168, 76.9558], capacity: 300, available: true },
  { id: '3', name: 'College Hall, Madurai', coordinates: [9.9252, 78.1198], capacity: 400, available: true },
  { id: '4', name: 'Sports Complex, Salem', coordinates: [11.6643, 78.1460], capacity: 600, available: false },
];

// Mock safe zones
const safeZones = [
  { id: '1', name: 'High Ground Area, Chennai', coordinates: [13.0920, 80.2870], radius: 2000 },
  { id: '2', name: 'Elevated Zone, Coimbatore', coordinates: [11.0268, 76.9658], radius: 1500 },
];

// Severity color mapping
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return '#C62828'; // error-900
    case 'high':
      return '#FB8C00'; // warning-500
    case 'medium':
      return '#FFC107'; // accent-400
    case 'low':
      return '#1E88E5'; // secondary-600
    default:
      return '#1E88E5';
  }
};

// Disaster icon mapping
const getDisasterIcon = (type: DisasterType) => {
  switch (type) {
    case 'flood':
      return 'blue';
    case 'cyclone':
      return 'purple';
    case 'earthquake':
      return 'orange';
    case 'tsunami':
      return 'blue';
    case 'fire':
      return 'red';
    case 'landslide':
      return 'brown';
    case 'drought':
      return 'yellow';
    case 'heatwave':
      return 'red';
    default:
      return 'gray';
  }
};

const GeospatialMapping = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const view = searchParams.get('view');
  
  const [disasters, setDisasters] = useState<DisasterAlert[]>(mockDisasters);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    user?.location?.coordinates || [13.0827, 80.2707] // Default to Chennai if no user location
  );
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterAlert | null>(null);
  const [showDisasters, setShowDisasters] = useState(true);
  const [showShelters, setShowShelters] = useState(view === 'shelters');
  const [showSafeZones, setShowSafeZones] = useState(true);
  
  // For incident reporting
  const [reportMode, setReportMode] = useState(mode === 'report');
  const [reportPosition, setReportPosition] = useState<[number, number] | null>(null);
  
  // Focus on selected disaster
  useEffect(() => {
    if (selectedDisaster) {
      setMapCenter(selectedDisaster.location.coordinates);
    }
  }, [selectedDisaster]);
  
  // Handle view change via URL params
  useEffect(() => {
    if (view === 'shelters') {
      setShowShelters(true);
    }
  }, [view]);
  
  // Handle map click for reporting
  const handleMapClick = (e: any) => {
    if (reportMode) {
      setReportPosition([e.latlng.lat, e.latlng.lng]);
    }
  };
  
  // Filter disasters
  const filterDisasters = (type: string) => {
    if (type === 'all') {
      setDisasters(mockDisasters);
    } else {
      setDisasters(mockDisasters.filter(d => d.type === type));
    }
  };
  
  // Submit incident report
  const submitReport = () => {
    if (!reportPosition) {
      alert('Please click on the map to indicate the incident location');
      return;
    }
    
    // In a real app, we would send this data to the server
    alert(`Incident report submitted for location: ${reportPosition[0]}, ${reportPosition[1]}`);
    
    // Reset reporting state
    setReportMode(false);
    setReportPosition(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate flex items-center">
              <MapPin className="h-8 w-8 text-primary-600 mr-3" />
              Geospatial Mapping
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Interactive map showing disaster zones, shelters, and safe areas
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Button 
              variant={showDisasters ? 'primary' : 'outline'}
              startIcon={<AlertTriangle />}
              onClick={() => setShowDisasters(!showDisasters)}
            >
              Disasters
            </Button>
            
            <Button 
              variant={showShelters ? 'primary' : 'outline'}
              startIcon={<Home />}
              onClick={() => setShowShelters(!showShelters)}
            >
              Shelters
            </Button>
            
            <Button 
              variant={showSafeZones ? 'primary' : 'outline'}
              startIcon={<Layers />}
              onClick={() => setShowSafeZones(!showSafeZones)}
            >
              Safe Zones
            </Button>
            
            <Button 
              variant={reportMode ? 'warning' : 'outline'}
              startIcon={<FileWarning />}
              onClick={() => {
                setReportMode(!reportMode);
                if (!reportMode) {
                  setReportPosition(null);
                }
              }}
            >
              {reportMode ? 'Cancel Report' : 'Report Incident'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reporting Instructions */}
      {reportMode && (
        <Card>
          <div className="text-center py-3">
            <h3 className="text-lg font-medium text-gray-900">Report an Incident</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click on the map to pinpoint the location of the incident.
            </p>
            {reportPosition && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  Selected position: {reportPosition[0].toFixed(6)}, {reportPosition[1].toFixed(6)}
                </p>
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={submitReport}
                >
                  Submit Report
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and disaster list */}
        <div className="space-y-6">
          {/* Disaster filters */}
          <Card title="Filter by Type">
            <div className="space-y-2">
              <button
                onClick={() => filterDisasters('all')}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                All Disasters
              </button>
              <button
                onClick={() => filterDisasters('flood')}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                Floods
              </button>
              <button
                onClick={() => filterDisasters('cyclone')}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                Cyclones
              </button>
              <button
                onClick={() => filterDisasters('earthquake')}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                Earthquakes
              </button>
              <button
                onClick={() => filterDisasters('fire')}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                Fires
              </button>
            </div>
          </Card>
          
          {/* Disaster list */}
          <Card title="Disaster Zones" className="lg:block">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {disasters.map(disaster => (
                <div 
                  key={disaster.id}
                  className={`
                    p-3 rounded-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors
                    ${selectedDisaster?.id === disaster.id ? 'bg-primary-50 border-primary-200' : ''}
                  `}
                  onClick={() => setSelectedDisaster(disaster)}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getSeverityColor(disaster.severity) }}
                    ></div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{disaster.title}</h4>
                      <p className="text-xs text-gray-500">
                        {disaster.location.district} - {format(new Date(disaster.timestamp), 'MMM d')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Legend */}
          <Card title="Map Legend">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <p className="text-sm text-gray-700">Critical</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <p className="text-sm text-gray-700">High</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <p className="text-sm text-gray-700">Medium</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <p className="text-sm text-gray-700">Low</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center space-x-3">
                  <Home className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-gray-700">Shelter</p>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Safe Zone</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card>
            <div className="h-[70vh] z-0">
              <MapContainer
                center={mapCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                onClick={handleMapClick}
              >
                <ChangeView center={mapCenter} />
                
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <LayersControl position="topright">
                  {/* Disaster markers */}
                  {showDisasters && disasters.map(disaster => (
                    <Marker 
                      key={disaster.id}
                      position={disaster.location.coordinates}
                      eventHandlers={{
                        click: () => {
                          setSelectedDisaster(disaster);
                        },
                      }}
                    >
                      <Popup>
                        <div className="max-w-xs">
                          <h3 className="font-medium text-gray-900">{disaster.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{disaster.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Location:</span> {disaster.location.district}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Severity:</span> {disaster.severity}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Date:</span> {format(new Date(disaster.timestamp), 'MMM d, yyyy')}
                          </p>
                          {disaster.affectedAreas.length > 0 && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Affected Areas:</span> {disaster.affectedAreas.join(', ')}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Shelter markers */}
                  {showShelters && shelters.map(shelter => (
                    <Marker 
                      key={shelter.id}
                      position={shelter.coordinates}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-medium text-gray-900">{shelter.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Capacity: {shelter.capacity} people
                          </p>
                          <p className={`text-sm ${shelter.available ? 'text-green-600' : 'text-red-600'} mt-1`}>
                            {shelter.available ? 'Available' : 'Full'}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Safe zones */}
                  {showSafeZones && safeZones.map(zone => (
                    <Circle
                      key={zone.id}
                      center={zone.coordinates}
                      radius={zone.radius}
                      pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-medium text-gray-900">{zone.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Safe zone with {(zone.radius / 1000).toFixed(1)} km radius
                          </p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                  
                  {/* Incident report marker */}
                  {reportPosition && (
                    <Marker position={reportPosition}>
                      <Popup>
                        <div>
                          <h3 className="font-medium text-gray-900">Incident Report</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Click submit to report an incident at this location
                          </p>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-2"
                            onClick={submitReport}
                          >
                            Submit Report
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </LayersControl>
              </MapContainer>
            </div>
          </Card>
          
          {/* Selected disaster details */}
          {selectedDisaster && (
            <Card className="mt-4">
              <div className="flex items-start space-x-4">
                <div 
                  className="rounded-full p-2"
                  style={{ backgroundColor: getSeverityColor(selectedDisaster.severity) }}
                >
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedDisaster.title}</h3>
                  <p className="mt-1 text-gray-600">{selectedDisaster.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{selectedDisaster.location.district}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedDisaster.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Severity</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedDisaster.severity}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(selectedDisaster.timestamp), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {selectedDisaster.affectedAreas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Affected Areas</p>
                      <p className="font-medium text-gray-900">{selectedDisaster.affectedAreas.join(', ')}</p>
                    </div>
                  )}
                  
                  {selectedDisaster.shelters && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Nearby Shelters</p>
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {selectedDisaster.shelters.map((shelter, index) => (
                          <li key={index} className="text-gray-700">
                            {shelter.name} ({shelter.capacity} capacity, 
                            {shelter.available ? ' available' : ' full'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeospatialMapping;