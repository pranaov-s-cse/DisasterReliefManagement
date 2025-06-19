export type ResourceCategory = 
  | 'food' 
  | 'water' 
  | 'medical' 
  | 'shelter' 
  | 'clothing' 
  | 'equipment';

export type ResourceStatus = 'available' | 'requested' | 'allocated' | 'depleted';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  status: ResourceStatus;
  location: {
    district: string;
    coordinates?: [number, number];
    address?: string;
  };
  expiryDate?: string;
  donatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceDonation {
  id: string;
  userId: string;
  userName: string;
  resources: {
    name: string;
    category: ResourceCategory;
    quantity: number;
    unit: string;
  }[];
  location: {
    district: string;
    coordinates?: [number, number];
    address?: string;
  };
  status: 'pending' | 'received' | 'distributed';
  notes?: string;
  createdAt: string;
}

export interface ResourceRequest {
  id: string;
  disasterId?: string;
  requestedBy: {
    id: string;
    name: string;
    role: 'user' | 'admin';
  };
  resources: {
    category: ResourceCategory;
    name: string;
    quantity: number;
    unit: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
  location: {
    district: string;
    coordinates?: [number, number];
    address?: string;
  };
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}