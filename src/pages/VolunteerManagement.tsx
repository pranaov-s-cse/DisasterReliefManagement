import { useState, useEffect } from 'react';
import { 
  Users, 
  Filter, 
  UserPlus, 
  Search, 
  CheckCircle, 
  Calendar,
  MapPin,
  AlertCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Volunteer, VolunteerSkill, VolunteerStatus } from '../types/volunteer';
import { mockVolunteers } from '../data/mockVolunteers';
import { mockDisasters } from '../data/mockDisasters';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface VolunteerManagementProps {
  isAdmin?: boolean;
}

const VolunteerManagement = ({ isAdmin = false }: VolunteerManagementProps) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [showRegistrationForm, setShowRegistrationForm] = useState(action === 'register');
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'all'>(
    isAdmin ? 'all' : 'available'
  );
  const [skillFilter, setSkillFilter] = useState<VolunteerSkill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Set tab based on URL action
  useEffect(() => {
    if (action === 'register') {
      setShowRegistrationForm(true);
    }
  }, [action]);
  
  // Filter volunteers by status
  useEffect(() => {
    let filtered = [...mockVolunteers];
    
    // Filter by tab (status)
    if (activeTab === 'available') {
      filtered = filtered.filter(v => v.status === 'available');
    } else if (activeTab === 'assigned') {
      filtered = filtered.filter(v => v.status === 'assigned');
    }
    
    // Filter by skill
    if (skillFilter) {
      filtered = filtered.filter(v => v.skills.includes(skillFilter));
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        v => v.name.toLowerCase().includes(lowercasedSearch) ||
             v.location.district.toLowerCase().includes(lowercasedSearch) ||
             v.skills.some(s => s.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    setFilteredVolunteers(filtered);
  }, [activeTab, skillFilter, searchTerm]);
  
  // Get skill label
  const getSkillLabel = (skill: VolunteerSkill) => {
    switch (skill) {
      case 'medical':
        return 'Medical';
      case 'rescue':
        return 'Rescue Operations';
      case 'logistics':
        return 'Logistics';
      case 'communications':
        return 'Communications';
      case 'counseling':
        return 'Counseling';
      case 'driving':
        return 'Driving';
      case 'cooking':
        return 'Cooking';
      case 'translation':
        return 'Translation';
      case 'technical':
        return 'Technical Support';
      default:
        return skill;
    }
  };
  
  // Filter by skill
  const filterBySkill = (skill: VolunteerSkill | null) => {
    setSkillFilter(skill);
  };
  
  // Submit volunteer registration
  const submitRegistration = (data: any) => {
    // Create new volunteer object
    const newVolunteer: Volunteer = {
      id: `v${volunteers.length + 1}`,
      userId: user?.id || 'temp-user',
      name: data.name,
      contactNumber: data.contactNumber,
      email: data.email,
      status: 'available' as VolunteerStatus,
      skills: (data.skills || []) as VolunteerSkill[],
      availability: {
        startDate: data.startDate,
        endDate: data.endDate,
        timeSlots: data.timeSlots ? [
          {
            day: data.timeSlots.day,
            startTime: data.timeSlots.startTime,
            endTime: data.timeSlots.endTime
          }
        ] : undefined
      },
      location: {
        district: data.district,
        coordinates: [0, 0], // In a real app, would get from geocoding service
        address: data.address
      },
      experience: data.experience,
      languages: data.languages ? data.languages.split(',').map((l: string) => l.trim()) : [],
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to volunteers state
    setVolunteers(prev => [newVolunteer, ...prev]);
    setFilteredVolunteers(prev => [newVolunteer, ...prev]);
    
    // In a real app, this would send data to the server
    console.log('Registration submitted:', newVolunteer);
    
    // Mock response
    alert('Thank you for registering as a volunteer! Your registration is being processed.');
    
    // Reset form and hide
    reset();
    setShowRegistrationForm(false);
    setSearchParams({});
  };
  
  // Submit volunteer assignment
  const submitAssignment = (data: any) => {
    if (!selectedVolunteer) return;
    
    // In a real app, this would send data to the server
    console.log('Assignment submitted:', { volunteer: selectedVolunteer.id, ...data });
    
    // Mock response
    alert(`Volunteer ${selectedVolunteer.name} has been assigned successfully.`);
    
    // Update volunteer status in our mock data
    const updatedVolunteers = volunteers.map(v => 
      v.id === selectedVolunteer.id
        ? {
            ...v,
            status: 'assigned' as VolunteerStatus,
            assignedTo: {
              disasterId: data.disasterId,
              disasterName: mockDisasters.find(d => d.id === data.disasterId)?.title || 'Unknown Disaster',
              role: data.role,
              startDate: data.startDate,
              endDate: data.endDate || undefined,
            }
          } as Volunteer
        : v
    );
    
    setVolunteers(updatedVolunteers);
    setFilteredVolunteers(updatedVolunteers);
    
    // Close modal and reset
    setShowAssignmentModal(false);
    setSelectedVolunteer(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate flex items-center">
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              {isAdmin ? 'Volunteer Management' : 'Volunteer Opportunities'}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              {isAdmin 
                ? 'Manage and assign volunteers to disaster relief efforts' 
                : 'Join volunteer efforts to help communities affected by disasters'}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            {!isAdmin && (
              <Button 
                variant="primary"
                startIcon={<UserPlus />}
                onClick={() => {
                  setShowRegistrationForm(true);
                  setSearchParams({ action: 'register' });
                }}
              >
                Register as Volunteer
              </Button>
            )}
            
            {isAdmin && (
              <Button 
                variant="outline"
                startIcon={<Filter />}
                onClick={() => {
                  // In a real app, this would toggle more advanced filters
                  alert('Advanced filters would be shown here');
                }}
              >
                Advanced Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-4">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
            >
              <option value="available">Available Volunteers</option>
              <option value="assigned">Assigned Volunteers</option>
              {isAdmin && <option value="all">All Volunteers</option>}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'available'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available Volunteers
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'assigned'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Assigned Volunteers
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'all'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Volunteers
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Volunteer Registration Form */}
      {showRegistrationForm && (
        <Card title="Volunteer Registration">
          <form onSubmit={handleSubmit(submitRegistration)}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      autoComplete="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      defaultValue={user?.name || ''}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      defaultValue={user?.email || ''}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      autoComplete="tel"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <select
                      id="district"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      defaultValue={user?.location?.district || ''}
                      {...register('district', { required: 'District is required' })}
                    >
                      <option value="">Select a district</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Salem">Salem</option>
                      <option value="Tirunelveli">Tirunelveli</option>
                      <option value="Tiruchirappalli">Tiruchirappalli</option>
                      <option value="Vellore">Vellore</option>
                      <option value="Thanjavur">Thanjavur</option>
                    </select>
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('address', { required: 'Address is required' })}
                    ></textarea>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900">Skills & Availability</h3>
                
                <div className="mt-4">
                  <legend className="text-sm font-medium text-gray-700">Skills</legend>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2">
                    {[
                      'medical',
                      'rescue',
                      'logistics',
                      'communications',
                      'counseling',
                      'driving',
                      'cooking',
                      'translation',
                      'technical'
                    ].map((skill) => (
                      <div key={skill} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`skill-${skill}`}
                            type="checkbox"
                            value={skill}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            {...register('skills', { required: 'Select at least one skill' })}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`skill-${skill}`} className="font-medium text-gray-700 capitalize">
                            {getSkillLabel(skill as VolunteerSkill)}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills.message as string}</p>
                  )}
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Available From
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('startDate', { required: 'Start date is required' })}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      Available Until
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('endDate', { required: 'End date is required' })}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      id="languages"
                      placeholder="e.g., Tamil, English, Telugu"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('languages', { required: 'Languages are required' })}
                    />
                    {errors.languages && (
                      <p className="mt-1 text-sm text-red-600">{errors.languages.message as string}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Relevant Experience (if any)
                    </label>
                    <textarea
                      id="experience"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('experience')}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                
                <div className="mt-4">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        {...register('terms', { required: 'You must agree to the terms' })}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        Terms and Conditions
                      </label>
                      <p className="text-gray-500">
                        I agree to be contacted for volunteer opportunities and to follow safety protocols.
                      </p>
                      {errors.terms && (
                        <p className="mt-1 text-sm text-red-600">{errors.terms.message as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setSearchParams({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Submit Registration
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
      
      {/* Volunteer Assignment Modal */}
      {showAssignmentModal && selectedVolunteer && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Assign Volunteer: {selectedVolunteer.name}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Complete the form below to assign this volunteer to a disaster relief effort.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5">
                <form onSubmit={handleSubmit(submitAssignment)}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="disasterId" className="block text-sm font-medium text-gray-700">
                        Select Disaster
                      </label>
                      <select
                        id="disasterId"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('disasterId', { required: 'Disaster is required' })}
                      >
                        <option value="">Select a disaster</option>
                        {mockDisasters.map((disaster) => (
                          <option key={disaster.id} value={disaster.id}>
                            {disaster.title} ({disaster.location.district})
                          </option>
                        ))}
                      </select>
                      {errors.disasterId && (
                        <p className="mt-1 text-sm text-red-600">{errors.disasterId.message as string}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Assignment Role
                      </label>
                      <input
                        type="text"
                        id="role"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="e.g., Medical Assistant, Rescue Team Member"
                        {...register('role', { required: 'Role is required' })}
                      />
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role.message as string}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...register('startDate', { required: 'Start date is required' })}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.startDate.message as string}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...register('endDate')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('notes')}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <Button
                      type="submit"
                      variant="primary"
                      className="sm:col-start-2"
                    >
                      Assign Volunteer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="sm:col-start-1"
                      onClick={() => {
                        setShowAssignmentModal(false);
                        setSelectedVolunteer(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Volunteers Listing */}
      {!showRegistrationForm && (
        <>
          {/* Skills filter and search */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter by skill:</span>
              <button
                onClick={() => filterBySkill(null)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  skillFilter === null ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Skills
              </button>
              <button
                onClick={() => filterBySkill('medical')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  skillFilter === 'medical' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => filterBySkill('rescue')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  skillFilter === 'rescue' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rescue
              </button>
              <button
                onClick={() => filterBySkill('logistics')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  skillFilter === 'logistics' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Logistics
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search volunteers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Volunteer Information */}
          {!isAdmin && activeTab === 'available' && (
            <Alert variant="info">
              <h3 className="text-sm font-medium text-secondary-800">About Volunteering</h3>
              <p className="mt-1 text-sm text-secondary-700">
                Volunteers play a crucial role in disaster management. By registering, you can help with rescue operations, medical assistance, logistics, and more depending on your skills.
              </p>
            </Alert>
          )}
          
          {/* Volunteers Grid */}
          {filteredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVolunteers.map((volunteer) => (
                <Card key={volunteer.id}>
                  <div>
                    <div className="flex justify-between">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium text-lg">
                            {volunteer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{volunteer.name}</h3>
                          <div className="flex items-center">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${volunteer.status === 'available' ? 'bg-success-100 text-success-800' : 
                                  volunteer.status === 'assigned' ? 'bg-secondary-100 text-secondary-800' : 
                                  'bg-warning-100 text-warning-800'}
                              `}
                            >
                              {volunteer.status}
                            </span>
                            {volunteer.verified && (
                              <span className="ml-2 flex items-center text-xs text-success-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isAdmin && volunteer.status === 'available' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowAssignmentModal(true);
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Availability</p>
                          <p className="font-medium">
                            {format(new Date(volunteer.availability.startDate), 'MMM d')} - 
                            {format(new Date(volunteer.availability.endDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium">{volunteer.location.district}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {volunteer.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {getSkillLabel(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {volunteer.experience && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Experience
                        </h4>
                        <p className="text-sm text-gray-600">
                          {volunteer.experience}
                        </p>
                      </div>
                    )}
                    
                    {volunteer.assignedTo && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <AlertCircle className="h-4 w-4 text-secondary-600 mr-1" />
                          Current Assignment
                        </h4>
                        <p className="text-sm font-medium">{volunteer.assignedTo.disasterName}</p>
                        <p className="text-sm text-gray-600">
                          Role: {volunteer.assignedTo.role}
                        </p>
                        <p className="text-sm text-gray-600">
                          From: {format(new Date(volunteer.assignedTo.startDate), 'MMM d, yyyy')}
                          {volunteer.assignedTo.endDate && 
                            ` to ${format(new Date(volunteer.assignedTo.endDate), 'MMM d, yyyy')}`}
                        </p>
                      </div>
                    )}
                    
                    {isAdmin && (
                      <div className="mt-4 flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would show volunteer details
                            alert(`View details for ${volunteer.name}`);
                          }}
                        >
                          View Details
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open contact dialog
                            alert(`Contact ${volunteer.name} at ${volunteer.email}`);
                          }}
                        >
                          Contact
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <p>No volunteers found matching your criteria.</p>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default VolunteerManagement;