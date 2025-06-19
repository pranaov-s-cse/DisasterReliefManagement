import { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DisasterType, SeverityLevel } from '../types/disaster';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  
  const [subscriptions, setSubscriptions] = useState<{
    types: DisasterType[];
    districts: string[];
    severity: SeverityLevel[];
  }>({
    types: ['flood', 'cyclone', 'earthquake'],
    districts: user?.location?.district ? [user.location.district] : [],
    severity: ['critical', 'high']
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSubscription = (type: 'types' | 'districts' | 'severity', value: string) => {
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
  
  const toggleNotification = (type: 'email' | 'sms' | 'push') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Mock disaster types for filtering
  const disasterTypes: DisasterType[] = ['flood', 'cyclone', 'earthquake', 'tsunami', 'fire', 'landslide', 'drought', 'heatwave'];
  
  // Mock severity levels for filtering
  const severityLevels: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
  
  // Mock districts from Tamil Nadu
  const districts = [
    'Chennai', 
    'Coimbatore', 
    'Madurai', 
    'Salem', 
    'Tirunelveli', 
    'Tiruchirappalli', 
    'Vellore', 
    'Thanjavur'
  ];
  
  // Mock save functions
  const saveProfile = () => {
    // In a real app, this would send updates to the server
    alert('Profile updated successfully!');
    setIsEditingProfile(false);
  };
  
  const saveNotifications = () => {
    // In a real app, this would send updates to the server
    alert('Notification preferences updated successfully!');
    setIsEditingNotifications(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate flex items-center">
            <UserCircle className="h-8 w-8 text-primary-600 mr-3" />
            My Profile
          </h2>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Manage your account settings and notification preferences
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card 
            title="Personal Information"
            footer={
              isEditingProfile ? (
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveProfile}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              )
            }
          >
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue={user?.name}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue={user?.email}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue="+91 9876543210"
                  />
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <select
                    id="district"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue={user?.location?.district}
                  >
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue="123 Main Street, Chennai"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <UserCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-base font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">+91 9876543210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900">
                      {user?.location?.district || 'Chennai'}
                      {user?.location?.coordinates && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({user.location.coordinates[0].toFixed(4)}, {user.location.coordinates[1].toFixed(4)})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">123 Main Street, Chennai</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Notification Preferences */}
          <Card 
            title="Notification Preferences"
            footer={
              isEditingNotifications ? (
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingNotifications(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveNotifications}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingNotifications(true)}
                >
                  Edit Preferences
                </Button>
              )
            }
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 text-primary-600 mr-2" />
                  Notification Channels
                </h3>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={notifications.email}
                        onChange={() => toggleNotification('email')}
                        disabled={!isEditingNotifications}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500">
                        Receive disaster alerts and updates via email
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={notifications.sms}
                        onChange={() => toggleNotification('sms')}
                        disabled={!isEditingNotifications}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                        SMS Notifications
                      </label>
                      <p className="text-gray-500">
                        Receive urgent alerts via SMS to your mobile phone
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-notifications"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={notifications.push}
                        onChange={() => toggleNotification('push')}
                        disabled={!isEditingNotifications}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-notifications" className="font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <p className="text-gray-500">
                        Receive alerts through the mobile app
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Alert Subscriptions</h3>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Disaster Types</h4>
                    <div className="mt-2 grid grid-cols-2 gap-y-2 gap-x-4">
                      {disasterTypes.map((type) => (
                        <div key={type} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`disaster-${type}`}
                              type="checkbox"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                              checked={subscriptions.types.includes(type)}
                              onChange={() => toggleSubscription('types', type)}
                              disabled={!isEditingNotifications}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`disaster-${type}`} className="font-medium text-gray-700 capitalize">
                              {type}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Severity Levels</h4>
                    <div className="mt-2 grid grid-cols-2 gap-y-2 gap-x-4">
                      {severityLevels.map((level) => (
                        <div key={level} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`severity-${level}`}
                              type="checkbox"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                              checked={subscriptions.severity.includes(level)}
                              onChange={() => toggleSubscription('severity', level)}
                              disabled={!isEditingNotifications}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`severity-${level}`} className="font-medium text-gray-700 capitalize">
                              {level}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Districts</h4>
                    <div className="mt-2 grid grid-cols-2 gap-y-2 gap-x-4">
                      {districts.map((district) => (
                        <div key={district} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`district-${district}`}
                              type="checkbox"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                              checked={subscriptions.districts.includes(district)}
                              onChange={() => toggleSubscription('districts', district)}
                              disabled={!isEditingNotifications}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`district-${district}`} className="font-medium text-gray-700">
                              {district}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Account Summary */}
          <Card title="Account Summary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Account Type</span>
                </div>
                <span className="text-sm font-medium capitalize">{user?.role || 'user'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Verified Email</span>
                </div>
                <span className="text-sm text-success-600 font-medium">Yes</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-warning-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Verified Phone</span>
                </div>
                <span className="text-sm text-warning-600 font-medium">Pending</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Button
                  variant="outline"
                  fullWidth
                  startIcon={<LogOut />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Activity Log */}
          <Card title="Recent Activity">
            <div className="space-y-4">
              <div className="border-l-2 border-primary-500 pl-3 py-1">
                <p className="text-sm font-medium text-gray-900">Account Login</p>
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
              </div>
              
              <div className="border-l-2 border-secondary-500 pl-3 py-1">
                <p className="text-sm font-medium text-gray-900">Updated Notification Preferences</p>
                <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
              </div>
              
              <div className="border-l-2 border-success-500 pl-3 py-1">
                <p className="text-sm font-medium text-gray-900">Registered as Volunteer</p>
                <p className="text-xs text-gray-500">May 15, 2025</p>
              </div>
              
              <div className="border-l-2 border-accent-400 pl-3 py-1">
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-xs text-gray-500">May 10, 2025</p>
              </div>
            </div>
          </Card>
          
          {/* Security */}
          <Card title="Security">
            <div className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    // In a real app, this would open a change password dialog
                    alert('Change password functionality would go here');
                  }}
                >
                  Change Password
                </Button>
              </div>
              
              <div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    // In a real app, this would open 2FA setup
                    alert('Two-factor authentication setup would go here');
                  }}
                >
                  Setup Two-Factor Auth
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;