import { Volunteer, VolunteerSkill } from '../types/volunteer';

export const mockVolunteers: Volunteer[] = [
  {
    id: '1',
    userId: '2',
    name: 'Regular User',
    contactNumber: '+91 9876543210',
    email: 'user@example.com',
    status: 'available',
    skills: ['medical', 'driving'],
    availability: {
      startDate: '2025-05-01',
      endDate: '2025-08-30',
      timeSlots: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          day: 'Wednesday',
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          day: 'Friday',
          startTime: '09:00',
          endTime: '17:00'
        }
      ]
    },
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      address: '123 Anna Street, Coimbatore'
    },
    experience: '2 years as a first aid volunteer',
    languages: ['Tamil', 'English'],
    verified: true,
    documents: [
      {
        type: 'ID Proof',
        url: 'https://example.com/id-proof',
        verified: true
      },
      {
        type: 'Medical Certificate',
        url: 'https://example.com/med-cert',
        verified: true
      }
    ],
    createdAt: '2025-04-15T10:30:00Z',
    updatedAt: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    name: 'John Doe',
    contactNumber: '+91 9876543211',
    email: 'john.doe@example.com',
    status: 'assigned',
    skills: ['rescue', 'driving', 'technical'],
    availability: {
      startDate: '2025-05-01',
      endDate: '2025-07-31'
    },
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      address: '45 Mount Road, Chennai'
    },
    experience: '5 years in rescue operations',
    languages: ['Tamil', 'English', 'Telugu'],
    assignedTo: {
      disasterId: 'flood-1',
      disasterName: 'Severe Flooding in Chennai',
      role: 'Rescue Team Lead',
      startDate: '2025-05-16',
    },
    verified: true,
    createdAt: '2025-04-20T14:15:00Z',
    updatedAt: '2025-05-16T09:30:00Z'
  },
  {
    id: '3',
    userId: '4',
    name: 'Priya S',
    contactNumber: '+91 9876543212',
    email: 'priya.s@example.com',
    status: 'available',
    skills: ['medical', 'counseling', 'translation'],
    availability: {
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      timeSlots: [
        {
          day: 'Monday',
          startTime: '18:00',
          endTime: '22:00'
        },
        {
          day: 'Tuesday',
          startTime: '18:00',
          endTime: '22:00'
        },
        {
          day: 'Saturday',
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          day: 'Sunday',
          startTime: '09:00',
          endTime: '17:00'
        }
      ]
    },
    location: {
      district: 'Madurai',
      coordinates: [9.9252, 78.1198],
      address: '78 East Street, Madurai'
    },
    experience: '3 years as a nurse, 2 years in disaster relief',
    languages: ['Tamil', 'English', 'Malayalam'],
    verified: true,
    createdAt: '2025-05-05T11:45:00Z',
    updatedAt: '2025-05-05T11:45:00Z'
  },
  {
    id: '4',
    userId: '5',
    name: 'Ramesh Kumar',
    contactNumber: '+91 9876543213',
    email: 'ramesh.k@example.com',
    status: 'unavailable',
    skills: ['logistics', 'driving', 'technical'],
    availability: {
      startDate: '2025-08-01',
      endDate: '2025-10-31'
    },
    location: {
      district: 'Salem',
      coordinates: [11.6643, 78.1460],
      address: '12 West Street, Salem'
    },
    experience: '10 years as a logistics coordinator',
    languages: ['Tamil', 'English'],
    verified: true,
    createdAt: '2025-05-10T15:30:00Z',
    updatedAt: '2025-05-10T15:30:00Z'
  },
  {
    id: '5',
    userId: '6',
    name: 'Lakshmi N',
    contactNumber: '+91 9876543214',
    email: 'lakshmi.n@example.com',
    status: 'available',
    skills: ['cooking', 'logistics', 'counseling'],
    availability: {
      startDate: '2025-05-01',
      endDate: '2025-12-31'
    },
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      address: '56 North Street, Coimbatore'
    },
    experience: '4 years in community service',
    languages: ['Tamil', 'English', 'Kannada'],
    verified: true,
    createdAt: '2025-05-12T13:20:00Z',
    updatedAt: '2025-05-12T13:20:00Z'
  }
];

export const getVolunteersByDistrict = (district: string): Volunteer[] => {
  return mockVolunteers.filter(volunteer => volunteer.location.district === district);
};

export const getVolunteersBySkill = (skill: VolunteerSkill): Volunteer[] => {
  return mockVolunteers.filter(volunteer => volunteer.skills.includes(skill));
};

export const getVolunteersByStatus = (status: string): Volunteer[] => {
  return mockVolunteers.filter(volunteer => volunteer.status === status);
};

export const getAvailableVolunteers = (): Volunteer[] => {
  return mockVolunteers.filter(volunteer => volunteer.status === 'available');
};