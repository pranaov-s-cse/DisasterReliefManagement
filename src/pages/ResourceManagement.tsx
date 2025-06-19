import { useState, useEffect } from 'react';
import { 
  Package2, 
  Droplet, 
  Utensils, 
  Stethoscope, 
  Home, 
  Plus,
  Search
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Resource, ResourceDonation, ResourceRequest } from '../types/resource';
import { mockResources, mockDonations, mockRequests } from '../data/mockResources';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

interface ResourceManagementProps {
  isAdmin?: boolean;
}

const ResourceManagement = ({ isAdmin = false }: ResourceManagementProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');
  
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [donations, setDonations] = useState<ResourceDonation[]>(mockDonations);
  const [requests, setRequests] = useState<ResourceRequest[]>(mockRequests);
  const [activeTab, setActiveTab] = useState<'resources' | 'donations' | 'requests'>(
    isAdmin ? 'resources' : 'donations'
  );
  const [showDonateForm, setShowDonateForm] = useState(action === 'donate');
  const [showRequestForm, setShowRequestForm] = useState(action === 'request');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Set tab based on URL action
  useEffect(() => {
    if (action === 'donate') {
      setActiveTab('donations');
      setShowDonateForm(true);
    } else if (action === 'request') {
      setActiveTab('requests');
      setShowRequestForm(true);
    }
  }, [action]);
  
  // Filter resources by category
  const filterByCategory = (category: string | null) => {
    setCategoryFilter(category);
    if (category) {
      setResources(mockResources.filter(r => r.category === category));
    } else {
      setResources(mockResources);
    }
  };
  
  // Apply search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      filterByCategory(categoryFilter);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    
    if (activeTab === 'resources') {
      const filtered = mockResources.filter(
        r => (categoryFilter ? r.category === categoryFilter : true) && 
             (r.name.toLowerCase().includes(lowercasedSearch) || 
              r.category.toLowerCase().includes(lowercasedSearch) ||
              r.location.district.toLowerCase().includes(lowercasedSearch))
      );
      setResources(filtered);
    }
  }, [searchTerm, categoryFilter, activeTab]);
  
  // Submit resource donation
  const submitDonation = (data: any) => {
    // Create a new donation object
    const newDonation: ResourceDonation = {
      id: `d${donations.length + 1}`,
      userId: 'current-user', // In a real app, this would come from auth
      userName: data.name,
      resources: [{
        name: data.resourceName,
        category: data.category,
        quantity: Number(data.quantity),
        unit: data.unit
      }],
      location: {
        district: data.district,
        address: data.address
      },
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString()
    };

    // Add to donations state
    setDonations(prev => [newDonation, ...prev]);
    
    // In a real app, this would send data to the server
    console.log('Donation submitted:', newDonation);
    
    // Mock response
    alert('Donation submitted successfully! Thank you for your contribution.');
    
    // Reset form and hide
    reset();
    setShowDonateForm(false);
    
    // Remove donate from URL
    setSearchParams({});
  };
  
  // Submit resource request
  const submitRequest = (data: any) => {
    // Create a new request object
    const newRequest: ResourceRequest = {
      id: `r${requests.length + 1}`,
      requestedBy: {
        id: 'current-user', // In a real app, this would come from auth
        name: data.name,
        role: 'user'
      },
      resources: [{
        name: data.resourceName,
        category: data.category,
        quantity: Number(data.quantity),
        unit: data.unit,
        priority: data.priority || 'medium'
      }],
      location: {
        district: data.district,
        address: data.address
      },
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to requests state
    setRequests(prev => [newRequest, ...prev]);
    
    // In a real app, this would send data to the server
    console.log('Request submitted:', newRequest);
    
    // Mock response
    alert('Resource request submitted successfully.');
    
    // Reset form and hide
    reset();
    setShowRequestForm(false);
    
    // Remove request from URL
    setSearchParams({});
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="h-5 w-5 text-success-500" />;
      case 'water':
        return <Droplet className="h-5 w-5 text-secondary-600" />;
      case 'medical':
        return <Stethoscope className="h-5 w-5 text-primary-600" />;
      case 'shelter':
        return <Home className="h-5 w-5 text-warning-500" />;
      default:
        return <Package2 className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg px-5 py-6 sm:px-6">
        <div className="border-b border-gray-200 pb-5 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate flex items-center">
              <Package2 className="h-8 w-8 text-primary-600 mr-3" />
              {isAdmin ? 'Resource Management' : 'Disaster Resources'}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              {isAdmin 
                ? 'Manage inventory, track donations, and allocate resources' 
                : 'Donate resources or request supplies for disaster relief'}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            {!isAdmin && (
              <>
                <Button 
                  variant="primary"
                  startIcon={<Plus />}
                  onClick={() => {
                    setShowDonateForm(true);
                    setShowRequestForm(false);
                    setActiveTab('donations');
                    setSearchParams({ action: 'donate' });
                  }}
                >
                  Donate Resources
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowRequestForm(true);
                    setShowDonateForm(false);
                    setActiveTab('requests');
                    setSearchParams({ action: 'request' });
                  }}
                >
                  Request Resources
                </Button>
              </>
            )}
            
            {isAdmin && (
              <Button 
                variant="primary"
                startIcon={<Plus />}
                onClick={() => {
                  // In a real app, this would open an admin form to add resources
                  alert('Add resources functionality would go here in the full app');
                }}
              >
                Add Resources
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
              <option value="resources">Available Resources</option>
              <option value="donations">Donations</option>
              <option value="requests">Resource Requests</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'resources'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available Resources
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'donations'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Donations
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'requests'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Resource Requests
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Donation Form */}
      {showDonateForm && (
        <Card title="Donate Resources">
          <form onSubmit={handleSubmit(submitDonation)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('contactNumber', { required: 'Contact number is required' })}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNumber.message as string}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <select
                  id="district"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('district', { required: 'District is required' })}
                >
                  <option value="">Select district</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.district.message as string}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Pickup Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('address', { required: 'Address is required' })}
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message as string}
                  </p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Donation Items</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <input
                        type="text"
                        id="itemName"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('itemName', { required: 'Item name is required' })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('category', { required: 'Category is required' })}
                      >
                        <option value="">Select category</option>
                        <option value="food">Food</option>
                        <option value="water">Water</option>
                        <option value="medical">Medical</option>
                        <option value="shelter">Shelter</option>
                        <option value="clothing">Clothing</option>
                        <option value="equipment">Equipment</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...register('quantity', { 
                            required: 'Quantity is required',
                            min: { value: 1, message: 'Must be at least 1' }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        <input
                          type="text"
                          id="unit"
                          placeholder="kg, pieces, etc."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...register('unit', { required: 'Unit is required' })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('notes')}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDonateForm(false);
                    setSearchParams({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Submit Donation
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
      
      {/* Request Form */}
      {showRequestForm && (
        <Card title="Request Resources">
          <form onSubmit={handleSubmit(submitRequest)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="requestorName" className="block text-sm font-medium text-gray-700">
                  Requestor Name
                </label>
                <input
                  type="text"
                  id="requestorName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('requestorName', { required: 'Name is required' })}
                />
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('contactNumber', { required: 'Contact number is required' })}
                />
              </div>
              
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <select
                  id="district"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('district', { required: 'District is required' })}
                >
                  <option value="">Select district</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('address', { required: 'Address is required' })}
                ></textarea>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Requested Items</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">
                        Resource Type
                      </label>
                      <select
                        id="resourceType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('resourceType', { required: 'Resource type is required' })}
                      >
                        <option value="">Select resource type</option>
                        <option value="Drinking Water">Drinking Water</option>
                        <option value="Food Packets">Food Packets</option>
                        <option value="Blankets">Blankets</option>
                        <option value="Medical Supplies">Medical Supplies</option>
                        <option value="Temporary Shelter">Temporary Shelter</option>
                        <option value="Clothing">Clothing</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('quantity', { 
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Must be at least 1' }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="priority"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('priority', { required: 'Priority is required' })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Reason for Request
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      {...register('reason', { required: 'Reason is required' })}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRequestForm(false);
                    setSearchParams({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
      
      {/* Resource Listings */}
      {activeTab === 'resources' && !showDonateForm && !showRequestForm && (
        <>
          {/* Filters and search */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <button
                onClick={() => filterByCategory(null)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  categoryFilter === null ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => filterByCategory('food')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  categoryFilter === 'food' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Utensils className="h-4 w-4 mr-1" /> Food
              </button>
              <button
                onClick={() => filterByCategory('water')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  categoryFilter === 'water' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Droplet className="h-4 w-4 mr-1" /> Water
              </button>
              <button
                onClick={() => filterByCategory('medical')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  categoryFilter === 'medical' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Stethoscope className="h-4 w-4 mr-1" /> Medical
              </button>
              <button
                onClick={() => filterByCategory('shelter')}
                className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                  categoryFilter === 'shelter' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home className="h-4 w-4 mr-1" /> Shelter
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Resources grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <Card key={resource.id}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{resource.category}</p>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Available</p>
                          <p className="font-medium text-gray-900">
                            {resource.quantity} {resource.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{resource.location.district}</p>
                        </div>
                        
                        {resource.expiryDate && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Expiry Date</p>
                            <p className="font-medium text-gray-900">
                              {format(new Date(resource.expiryDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {isAdmin && (
                        <div className="mt-4 flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // In a real app, this would open an edit modal
                              alert(`Edit resource: ${resource.name}`);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // In a real app, this would open an allocate modal
                              alert(`Allocate resource: ${resource.name}`);
                            }}
                          >
                            Allocate
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Alert variant="info">
                  <p>No resources found matching your search criteria.</p>
                </Alert>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Donations tab */}
      {activeTab === 'donations' && !showDonateForm && !showRequestForm && (
        <div className="space-y-6">
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-800">How to Donate</h3>
            <p className="mt-1 text-sm text-secondary-700">
              Click the "Donate Resources" button above to contribute resources for disaster relief. Donations are collected at designated centers in each district.
            </p>
          </div>
          
          <Card title="Recent Donations">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resources
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{donation.userName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {donation.resources.map((r, index) => (
                            <div key={index}>
                              {r.quantity} {r.unit} {r.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{donation.location.district}</div>
                        <div className="text-sm text-gray-500">{donation.location.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${donation.status === 'received' ? 'bg-success-100 text-success-800' : 
                            donation.status === 'distributed' ? 'bg-secondary-100 text-secondary-800' : 
                            'bg-warning-100 text-warning-800'}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(donation.createdAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      
      {/* Requests tab */}
      {activeTab === 'requests' && !showDonateForm && !showRequestForm && (
        <div className="space-y-6">
          {!isAdmin && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary-800">Request Resources</h3>
              <p className="mt-1 text-sm text-primary-700">
                If you or your community needs resources for disaster relief, click the "Request Resources" button above. Requests are reviewed and processed based on priority and availability.
              </p>
            </div>
          )}
          
          <Card title={isAdmin ? "Resource Requests" : "Your Requests"}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requestor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resources
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    {isAdmin && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">#{request.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.requestedBy.name}</div>
                        <div className="text-xs text-gray-500">{request.requestedBy.role}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {request.resources.map((r, index) => (
                            <div key={index} className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-1 
                                ${r.priority === 'critical' ? 'bg-error-600' : 
                                  r.priority === 'high' ? 'bg-warning-500' : 
                                  r.priority === 'medium' ? 'bg-accent-400' : 
                                  'bg-secondary-600'}`}
                              ></span>
                              {r.quantity} {r.unit} {r.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.location.district}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'approved' ? 'bg-success-100 text-success-800' : 
                            request.status === 'fulfilled' ? 'bg-secondary-100 text-secondary-800' : 
                            request.status === 'rejected' ? 'bg-error-100 text-error-800' : 
                            'bg-warning-100 text-warning-800'}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className={`text-sm ${
                                request.status === 'pending' ? 'text-success-600 hover:text-success-800' : 'text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={request.status !== 'pending'}
                              onClick={() => {
                                // In a real app, this would call an API
                                alert(`Approve request #${request.id}`);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className={`text-sm ${
                                request.status === 'pending' ? 'text-error-600 hover:text-error-800' : 'text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={request.status !== 'pending'}
                              onClick={() => {
                                // In a real app, this would call an API
                                alert(`Reject request #${request.id}`);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;