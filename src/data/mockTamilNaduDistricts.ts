export interface District {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  population: number;
  area: number; // in sq. km
  disasterProne: {
    flood: boolean;
    cyclone: boolean;
    drought: boolean;
    earthquake: boolean;
    tsunami: boolean;
    landslide: boolean;
  };
}

export const tamilNaduDistricts: District[] = [
  {
    id: '1',
    name: 'Chennai',
    coordinates: [13.0827, 80.2707],
    population: 7100000,
    area: 426,
    disasterProne: {
      flood: true,
      cyclone: true,
      drought: false,
      earthquake: false,
      tsunami: true,
      landslide: false
    }
  },
  {
    id: '2',
    name: 'Coimbatore',
    coordinates: [11.0168, 76.9558],
    population: 3472578,
    area: 7649,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: true,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '3',
    name: 'Madurai',
    coordinates: [9.9252, 78.1198],
    population: 3038252,
    area: 3696,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '4',
    name: 'Salem',
    coordinates: [11.6643, 78.1460],
    population: 3482056,
    area: 5245,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '5',
    name: 'Tirunelveli',
    coordinates: [8.7139, 77.7567],
    population: 1665253,
    area: 6810,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '6',
    name: 'Tiruchirappalli',
    coordinates: [10.7905, 78.7047],
    population: 2722290,
    area: 4404,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '7',
    name: 'Cuddalore',
    coordinates: [11.7480, 79.7714],
    population: 2605914,
    area: 3678,
    disasterProne: {
      flood: true,
      cyclone: true,
      drought: false,
      earthquake: false,
      tsunami: true,
      landslide: false
    }
  },
  {
    id: '8',
    name: 'Tiruppur',
    coordinates: [11.1085, 77.3411],
    population: 2471222,
    area: 5187,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '9',
    name: 'Kancheepuram',
    coordinates: [12.8185, 79.6947],
    population: 3998252,
    area: 4483,
    disasterProne: {
      flood: true,
      cyclone: true,
      drought: false,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '10',
    name: 'Dindigul',
    coordinates: [10.3624, 77.9695],
    population: 2159775,
    area: 6266,
    disasterProne: {
      flood: false,
      cyclone: false,
      drought: true,
      earthquake: false,
      tsunami: false,
      landslide: false
    }
  },
  {
    id: '11',
    name: 'Nilgiris',
    coordinates: [11.4102, 76.6950],
    population: 735394,
    area: 2565,
    disasterProne: {
      flood: true,
      cyclone: false,
      drought: false,
      earthquake: false,
      tsunami: false,
      landslide: true
    }
  },
  {
    id: '12',
    name: 'Nagapattinam',
    coordinates: [10.7672, 79.8449],
    population: 1616450,
    area: 2715,
    disasterProne: {
      flood: true,
      cyclone: true,
      drought: false,
      earthquake: false,
      tsunami: true,
      landslide: false
    }
  }
];

export const getDistrict = (name: string): District | undefined => {
  return tamilNaduDistricts.find(district => 
    district.name.toLowerCase() === name.toLowerCase()
  );
};

export const getDistricts = (): District[] => {
  return tamilNaduDistricts;
};

export const getDistrictsWithDisasterProne = (disasterType: keyof District['disasterProne']): District[] => {
  return tamilNaduDistricts.filter(district => district.disasterProne[disasterType]);
};