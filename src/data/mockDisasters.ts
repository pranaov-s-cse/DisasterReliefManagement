import { DisasterAlert } from '../types/disaster';

export const mockDisasters: DisasterAlert[] = [
  {
    id: 'flood-1',
    type: 'flood',
    title: 'Severe Flooding in Chennai',
    description: 'Heavy rainfall has caused significant flooding across Chennai. Several neighborhoods are underwater, and residents are advised to evacuate to higher ground.',
    location: {
      district: 'Chennai',
      coordinates: [13.0827, 80.2707]
    },
    severity: 'critical',
    timestamp: '2025-05-15T08:30:00Z',
    affectedAreas: ['Velachery', 'T. Nagar', 'Mylapore', 'Adyar'],
    resources: {
      required: ['boats', 'drinking water', 'food packets', 'medical supplies'],
      available: ['drinking water', 'food packets']
    },
    evacuationRoutes: [
      {
        description: 'Evacuate from Velachery to Guindy',
        coordinates: [
          [12.9842, 80.2189],
          [13.0067, 80.2206]
        ]
      }
    ],
    shelters: [
      {
        name: 'Government School, Guindy',
        capacity: 500,
        coordinates: [13.0067, 80.2206],
        available: true
      },
      {
        name: 'Community Hall, T. Nagar',
        capacity: 300,
        coordinates: [13.0418, 80.2341],
        available: true
      }
    ],
    updates: [
      {
        timestamp: '2025-05-15T10:15:00Z',
        content: 'Water level has risen by 2 feet in Velachery. Rescue operations underway.'
      },
      {
        timestamp: '2025-05-15T12:30:00Z',
        content: 'Army deployed for rescue operations in severely affected areas.'
      }
    ]
  },
  {
    id: 'cyclone-1',
    type: 'cyclone',
    title: 'Cyclone Warning for Coastal Tamil Nadu',
    description: 'A severe cyclonic storm is expected to hit coastal Tamil Nadu in the next 48 hours. Wind speeds may reach up to 120 km/h.',
    location: {
      district: 'Cuddalore',
      coordinates: [11.7520, 79.7680]
    },
    severity: 'high',
    timestamp: '2025-06-10T14:00:00Z',
    affectedAreas: ['Cuddalore', 'Nagapattinam', 'Puducherry', 'Karaikal'],
    resources: {
      required: ['shelter materials', 'food packets', 'medical supplies'],
      available: ['food packets']
    },
    evacuationRoutes: [
      {
        description: 'Evacuate from coastal areas to inland shelters',
        coordinates: [
          [11.7520, 79.7680],
          [11.7983, 79.7148]
        ]
      }
    ],
    shelters: [
      {
        name: 'Government College, Cuddalore',
        capacity: 800,
        coordinates: [11.7450, 79.7700],
        available: true
      },
      {
        name: 'Municipal Hall, Chidambaram',
        capacity: 500,
        coordinates: [11.3993, 79.6961],
        available: true
      }
    ]
  },
  {
    id: 'earthquake-1',
    type: 'earthquake',
    title: 'Mild Earthquake Tremors in Western Tamil Nadu',
    description: 'Mild tremors of magnitude 4.2 reported across several regions of Western Tamil Nadu. No major damage reported.',
    location: {
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558]
    },
    severity: 'medium',
    timestamp: '2025-07-05T03:15:00Z',
    affectedAreas: ['Coimbatore', 'Erode', 'Tiruppur'],
    resources: {
      required: ['inspection teams', 'emergency kits'],
      available: ['emergency kits']
    }
  },
  {
    id: 'fire-1',
    type: 'fire',
    title: 'Industrial Fire in Ambattur',
    description: 'A major fire has broken out in an industrial area in Ambattur. Fire services are working to contain the blaze.',
    location: {
      district: 'Chennai',
      coordinates: [13.0982, 80.1625]
    },
    severity: 'high',
    timestamp: '2025-08-20T16:45:00Z',
    affectedAreas: ['Ambattur Industrial Estate', 'Padi'],
    resources: {
      required: ['fire engines', 'medical teams', 'evacuation assistance'],
      available: ['fire engines', 'medical teams']
    },
    updates: [
      {
        timestamp: '2025-08-20T17:30:00Z',
        content: 'Fire has spread to adjacent buildings. Additional fire engines deployed.'
      },
      {
        timestamp: '2025-08-20T18:45:00Z',
        content: 'Fire containment operations successful. Cooling operations underway.'
      }
    ]
  },
  {
    id: 'drought-1',
    type: 'drought',
    title: 'Severe Drought in Southern Districts',
    description: 'Prolonged dry spell has led to severe drought conditions in southern districts of Tamil Nadu.',
    location: {
      district: 'Madurai',
      coordinates: [9.9252, 78.1198]
    },
    severity: 'high',
    timestamp: '2025-04-10T09:00:00Z',
    affectedAreas: ['Madurai', 'Ramanathapuram', 'Sivaganga', 'Virudhunagar'],
    resources: {
      required: ['water tankers', 'fodder for livestock', 'drought relief funds'],
      available: ['water tankers']
    }
  },
  {
    id: 'landslide-1',
    type: 'landslide',
    title: 'Landslides in Nilgiris',
    description: 'Heavy rainfall has triggered multiple landslides in the Nilgiris district. Several roads are blocked.',
    location: {
      district: 'Nilgiris',
      coordinates: [11.4102, 76.6950]
    },
    severity: 'high',
    timestamp: '2025-09-05T12:30:00Z',
    affectedAreas: ['Ooty', 'Coonoor', 'Kotagiri'],
    resources: {
      required: ['excavators', 'rescue teams', 'medical supplies'],
      available: ['rescue teams']
    },
    evacuationRoutes: [
      {
        description: 'Alternate route from Ooty to Coonoor via Lovedale',
        coordinates: [
          [11.4102, 76.6950],
          [11.3472, 76.7992]
        ]
      }
    ]
  },
  {
    id: 'heatwave-1',
    type: 'heatwave',
    title: 'Extreme Heat Wave Alert in Northern Tamil Nadu',
    description: 'Severe heat wave conditions with temperatures exceeding 43°C expected in northern districts. Elderly and children at high risk.',
    location: {
      district: 'Vellore',
      coordinates: [12.9165, 79.1325]
    },
    severity: 'critical',
    timestamp: '2025-05-14T10:00:00Z',
    affectedAreas: ['Vellore', 'Tirupattur', 'Ranipet', 'Tiruvallur'],
    resources: {
      required: ['cooling centers', 'water supply', 'medical assistance', 'emergency response teams'],
      available: ['water supply', 'medical assistance']
    },
    updates: [
      {
        timestamp: '2025-05-14T12:00:00Z',
        content: 'Temperature reaches 44°C in Vellore. Schools and colleges closed.'
      },
      {
        timestamp: '2025-05-14T14:30:00Z',
        content: 'Additional cooling centers being set up in affected areas.'
      }
    ],
    healthAdvisory: 'Stay indoors between 11 AM and 4 PM. Keep hydrated. Check on elderly neighbors.',
    impactedSectors: ['agriculture', 'public health', 'education'],
    emergencyContacts: [
      {
        department: 'Health Services',
        number: '044-2345-6789'
      },
      {
        department: 'Emergency Response',
        number: '044-9876-5432'
      }
    ]
  },
  {
    id: 'tsunami-1',
    type: 'tsunami',
    title: 'Tsunami Warning for Eastern Coast',
    description: 'Potential tsunami threat following 8.2 magnitude earthquake in Indian Ocean. Coastal areas on high alert.',
    location: {
      district: 'Nagapattinam',
      coordinates: [10.7672, 79.8449]
    },
    severity: 'critical',
    timestamp: '2025-05-15T01:30:00Z',
    affectedAreas: ['Nagapattinam', 'Karaikal', 'Cuddalore', 'Ramanathapuram'],
    resources: {
      required: ['evacuation boats', 'emergency shelters', 'medical teams', 'rescue equipment', 'communication systems'],
      available: ['emergency shelters', 'medical teams']
    },
    evacuationRoutes: [
      {
        description: 'Immediate evacuation from coastal areas to designated safe zones',
        coordinates: [
          [10.7672, 79.8449],
          [10.8012, 79.7123]
        ]
      }
    ],
    shelters: [
      {
        name: 'Government Arts College, Kumbakonam',
        capacity: 1000,
        coordinates: [10.9602, 79.3845],
        available: true
      },
      {
        name: 'Municipal Stadium, Thanjavur',
        capacity: 1500,
        coordinates: [10.7870, 79.1378],
        available: true
      }
    ],
    updates: [
      {
        timestamp: '2025-05-15T01:45:00Z',
        content: 'First wave expected to hit coast in approximately 3 hours. Immediate evacuation advised.'
      },
      {
        timestamp: '2025-05-15T02:15:00Z',
        content: 'Navy and Coast Guard vessels deployed for emergency response.'
      },
      {
        timestamp: '2025-05-15T02:45:00Z',
        content: 'Evacuation of coastal villages in progress. 60% complete.'
      }
    ],
    warningLevels: {
      current: 'Red',
      expected: 'Red',
      timeToImpact: '2.5 hours'
    },
    emergencyContacts: [
      {
        department: 'Coast Guard',
        number: '1800-123-4567'
      },
      {
        department: 'District Emergency Ops',
        number: '044-8765-4321'
      }
    ]
  }
];

export const getDisastersByDistrict = (district: string): DisasterAlert[] => {
  return mockDisasters.filter(disaster => 
    disaster.location.district === district || 
    disaster.affectedAreas.includes(district)
  );
};

export const getDisastersByType = (type: string): DisasterAlert[] => {
  return mockDisasters.filter(disaster => disaster.type === type);
};

export const getDisastersByRadius = (lat: number, lng: number, radiusKm: number): DisasterAlert[] => {
  const earthRadiusKm = 6371;
  return mockDisasters.filter(disaster => {
    const dLat = (disaster.location.coordinates[0] - lat) * Math.PI / 180;
    const dLon = (disaster.location.coordinates[1] - lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(disaster.location.coordinates[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = earthRadiusKm * c;
    
    return distance <= radiusKm;
  });
};