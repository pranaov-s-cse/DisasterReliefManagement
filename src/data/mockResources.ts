import { Resource, ResourceDonation, ResourceRequest } from '../types/resource';

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Drinking Water (1L bottles)',
    category: 'water',
    quantity: 5000,
    unit: 'bottles',
    status: 'available',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: 'Central Warehouse, Anna Salai, Chennai'
    },
    expiryDate: '2026-12-31',
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Rice',
    category: 'food',
    quantity: 2000,
    unit: 'kg',
    status: 'available',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: 'Food Corporation Warehouse, Koyambedu, Chennai'
    },
    expiryDate: '2026-08-15',
    createdAt: '2025-05-02T11:30:00Z',
    updatedAt: '2025-05-02T11:30:00Z'
  },
  {
    id: '3',
    name: 'First Aid Kits',
    category: 'medical',
    quantity: 500,
    unit: 'kits',
    status: 'available',
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      address: 'Medical Supply Center, Gandhipuram, Coimbatore'
    },
    createdAt: '2025-05-03T09:15:00Z',
    updatedAt: '2025-05-03T09:15:00Z'
  },
  {
    id: '4',
    name: 'Blankets',
    category: 'shelter',
    quantity: 1200,
    unit: 'pieces',
    status: 'available',
    location: {
      district: 'Madurai',
      coordinates: [9.9252, 78.1198],
      address: 'Relief Supplies Depot, Mattuthavani, Madurai'
    },
    createdAt: '2025-05-04T15:45:00Z',
    updatedAt: '2025-05-04T15:45:00Z'
  },
  {
    id: '5',
    name: 'Emergency Tents',
    category: 'shelter',
    quantity: 300,
    unit: 'tents',
    status: 'available',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: 'Disaster Management Warehouse, Guindy, Chennai'
    },
    createdAt: '2025-05-05T13:20:00Z',
    updatedAt: '2025-05-05T13:20:00Z'
  },
  {
    id: '6',
    name: 'Paracetamol Tablets',
    category: 'medical',
    quantity: 10000,
    unit: 'strips',
    status: 'available',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: 'Medical Supplies Store, Anna Nagar, Chennai'
    },
    expiryDate: '2027-03-15',
    createdAt: '2025-05-06T10:10:00Z',
    updatedAt: '2025-05-06T10:10:00Z'
  },
  {
    id: '7',
    name: 'Ready-to-eat Meals',
    category: 'food',
    quantity: 5000,
    unit: 'packets',
    status: 'available',
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      address: 'Food Distribution Center, Peelamedu, Coimbatore'
    },
    expiryDate: '2025-12-31',
    createdAt: '2025-05-07T11:55:00Z',
    updatedAt: '2025-05-07T11:55:00Z'
  },
  {
    id: '8',
    name: 'Portable Water Filters',
    category: 'water',
    quantity: 200,
    unit: 'units',
    status: 'available',
    location: {
      district: 'Salem',
      coordinates: [11.6643, 78.1460],
      address: 'Equipment Storage Facility, Salem'
    },
    createdAt: '2025-05-08T14:30:00Z',
    updatedAt: '2025-05-08T14:30:00Z'
  }
];

export const mockDonations: ResourceDonation[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Regular User',
    resources: [
      {
        name: 'Drinking Water',
        category: 'water',
        quantity: 100,
        unit: 'bottles'
      },
      {
        name: 'Biscuit Packets',
        category: 'food',
        quantity: 50,
        unit: 'packets'
      }
    ],
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      address: '123 Anna Street, Coimbatore'
    },
    status: 'received',
    notes: 'Donated at local collection center',
    createdAt: '2025-05-10T09:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'John Doe',
    resources: [
      {
        name: 'Blankets',
        category: 'shelter',
        quantity: 20,
        unit: 'pieces'
      }
    ],
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: '45 Mount Road, Chennai'
    },
    status: 'pending',
    notes: 'Will deliver to central warehouse',
    createdAt: '2025-05-11T14:15:00Z'
  },
  {
    id: '3',
    userId: '4',
    userName: 'Local Business',
    resources: [
      {
        name: 'First Aid Kits',
        category: 'medical',
        quantity: 30,
        unit: 'kits'
      },
      {
        name: 'Hand Sanitizers',
        category: 'medical',
        quantity: 100,
        unit: 'bottles'
      }
    ],
    location: {
      district: 'Madurai',
      coordinates: [9.9252, 78.1198],
      address: 'Business Park, Madurai'
    },
    status: 'distributed',
    notes: 'Corporate donation',
    createdAt: '2025-05-12T11:45:00Z'
  }
];

export const mockRequests: ResourceRequest[] = [
  {
    id: '1',
    disasterId: 'flood-1',
    requestedBy: {
      id: '5',
      name: 'Field Officer',
      role: 'admin'
    },
    resources: [
      {
        category: 'water',
        name: 'Drinking Water',
        quantity: 1000,
        unit: 'bottles',
        priority: 'critical'
      },
      {
        category: 'food',
        name: 'Ready-to-eat Meals',
        quantity: 500,
        unit: 'packets',
        priority: 'high'
      }
    ],
    location: {
      district: 'Chennai',
      coordinates: [13.0415, 80.1823],
      address: 'Velachery Main Road, Chennai'
    },
    status: 'approved',
    notes: 'Needed urgently for flood victims',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T12:30:00Z'
  },
  {
    id: '2',
    disasterId: 'cyclone-1',
    requestedBy: {
      id: '6',
      name: 'Shelter Manager',
      role: 'user'
    },
    resources: [
      {
        category: 'shelter',
        name: 'Blankets',
        quantity: 200,
        unit: 'pieces',
        priority: 'high'
      },
      {
        category: 'medical',
        name: 'First Aid Kits',
        quantity: 50,
        unit: 'kits',
        priority: 'medium'
      }
    ],
    location: {
      district: 'Cuddalore',
      coordinates: [11.7520, 79.7680],
      address: 'Government School, Cuddalore'
    },
    status: 'pending',
    notes: 'For cyclone shelter',
    createdAt: '2025-06-11T08:45:00Z',
    updatedAt: '2025-06-11T08:45:00Z'
  },
  {
    id: '3',
    requestedBy: {
      id: '7',
      name: 'Relief Coordinator',
      role: 'admin'
    },
    resources: [
      {
        category: 'water',
        name: 'Portable Water Filters',
        quantity: 20,
        unit: 'units',
        priority: 'medium'
      }
    ],
    location: {
      district: 'Madurai',
      coordinates: [9.9252, 78.1198],
      address: 'South Veli Street, Madurai'
    },
    status: 'fulfilled',
    notes: 'For drought-affected areas',
    createdAt: '2025-04-15T09:30:00Z',
    updatedAt: '2025-04-16T14:20:00Z'
  }
];

export const getResourcesByDistrict = (district: string): Resource[] => {
  return mockResources.filter(resource => resource.location.district === district);
};

export const getResourcesByCategory = (category: string): Resource[] => {
  return mockResources.filter(resource => resource.category === category);
};

export const getResourcesByStatus = (status: string): Resource[] => {
  return mockResources.filter(resource => resource.status === status);
};