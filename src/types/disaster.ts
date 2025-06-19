export type DisasterType = 
  | 'flood' 
  | 'cyclone' 
  | 'earthquake' 
  | 'tsunami' 
  | 'fire' 
  | 'landslide' 
  | 'drought' 
  | 'heatwave';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DisasterAlert {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  location: {
    district: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  severity: SeverityLevel;
  timestamp: string;
  affectedAreas: string[];
  resources?: {
    required: string[];
    available: string[];
  };
  evacuationRoutes?: {
    description: string;
    coordinates: [number, number][];
  }[];
  shelters?: {
    name: string;
    capacity: number;
    coordinates: [number, number];
    available: boolean;
  }[];
  updates?: {
    timestamp: string;
    content: string;
  }[];
  healthAdvisory?: string;
  impactedSectors?: string[];
  emergencyContacts?: {
    department: string;
    number: string;
  }[];
  warningLevels?: {
    current: string;
    expected: string;
    timeToImpact: string;
  };
}

export interface DisasterSubscription {
  userId: string;
  disasterTypes: DisasterType[];
  districts: string[];
  severityLevels: SeverityLevel[];
  notificationChannels: ('email' | 'sms' | 'push')[];
}