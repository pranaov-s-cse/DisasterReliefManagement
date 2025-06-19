export type VolunteerStatus = 'available' | 'assigned' | 'unavailable';
export type VolunteerSkill = 
  | 'medical' 
  | 'rescue' 
  | 'logistics' 
  | 'communications' 
  | 'counseling' 
  | 'driving' 
  | 'cooking' 
  | 'translation' 
  | 'technical';

export interface Volunteer {
  id: string;
  userId: string;
  name: string;
  contactNumber: string;
  email: string;
  status: VolunteerStatus;
  skills: VolunteerSkill[];
  availability: {
    startDate: string;
    endDate: string;
    timeSlots?: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  location: {
    district: string;
    coordinates: [number, number];
    address?: string;
  };
  experience?: string;
  languages: string[];
  assignedTo?: {
    disasterId: string;
    disasterName: string;
    role: string;
    startDate: string;
    endDate?: string;
  };
  verified: boolean;
  documents?: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerRegistration {
  name: string;
  contactNumber: string;
  email: string;
  skills: VolunteerSkill[];
  availability: {
    startDate: string;
    endDate: string;
    timeSlots?: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  district: string;
  address?: string;
  coordinates: [number, number];
  experience?: string;
  languages: string[];
}

export interface VolunteerAssignment {
  volunteerId: string;
  disasterId: string;
  role: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  assignedBy: string;
}