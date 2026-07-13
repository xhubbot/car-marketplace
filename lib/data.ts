import { CarListing } from './types';

export const CAR_LISTINGS: CarListing[] = [
  {
    id: 'porsche-taycan',
    make: 'Porsche',
    model: 'Taycan 4S',
    year: 2022,
    price: 89500,
    image: '/images/car_1.jpg',
    lifestyle: 'speed',
    lifestyleLabel: 'Speed Therapy',
    lifestyleDesc: 'Instant electric acceleration paired with telepathic Porsche handling.',
    truthScore: 82,
    truthBreakdown: {
      valueRetention: 68,
      runningCosts: 88,
      reliability: 90
    },
    specs: {
      engine: 'Dual Electric Motor (Performance Plus)',
      power: '530 hp',
      acceleration: '4.0s (0-100 km/h)',
      fuelEfficiency: 21.0,
      fuelType: 'electric',
      range: '407 km',
      transmission: '2-Speed Automatic',
      driveType: 'AWD'
    },
    expenses: {
      loanPayment: 1350,
      repairs: 120,
      insurance: 240,
      depreciation: 590
    },
    highlights: [
      'Porsche Approved Certified Pre-Owned',
      'Performance Battery Plus Pack',
      'Rear-Axle Steering with Power Steering Plus',
      '21-inch Mission E Wheels'
    ],
    ownerReview: 'The handling defies physics. It feels like a core Porsche 911 but sits 4 adults comfortably. Daily running cost is next to nothing if you charge on solar, though insurance is quite steep.',
    seller: {
      name: 'Apex Premium Motors',
      type: 'dealer',
      rating: 4.9,
      phone: '+1 (555) 309-8800',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120'
    },
    color: 'Carrara White Metallic'
  },
  {
    id: 'tesla-model-y',
    make: 'Tesla',
    model: 'Model Y Long Range',
    year: 2023,
    price: 45800,
    image: '/images/car_2.jpg',
    lifestyle: 'commute',
    lifestyleLabel: 'Silent Commute',
    lifestyleDesc: 'Hyper-efficient daily utility with cutting-edge tech integration.',
    truthScore: 94,
    truthBreakdown: {
      valueRetention: 89,
      runningCosts: 96,
      reliability: 97
    },
    specs: {
      engine: 'Dual AC Electric Motors',
      power: '384 hp',
      acceleration: '5.0s (0-100 km/h)',
      fuelEfficiency: 16.5,
      fuelType: 'electric',
      range: '533 km',
      transmission: 'Single-Speed Direct',
      driveType: 'AWD'
    },
    expenses: {
      loanPayment: 680,
      repairs: 45,
      insurance: 170,
      depreciation: 290
    },
    highlights: [
      'Full Self-Driving Capability Included',
      'Battery & Drive Unit Warranty to 2031',
      '19" Gemini Wheels with Premium Tires',
      'Premium Custom Quicksilver Paint'
    ],
    ownerReview: 'It is basically a spacious tech appliance that drives like a rocket. It fits my dog, surfboard, and Costco runs in one trip. The supercharger network makes road-tripping entirely brain-free.',
    seller: {
      name: 'Sarah Jenkins',
      type: 'private',
      rating: 4.8,
      phone: '+1 (555) 712-4422',
      location: 'San Jose, CA',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120'
    },
    color: 'Quicksilver Metallic'
  },
  {
    id: 'toyota-rav4',
    make: 'Toyota',
    model: 'RAV4 Hybrid XSE',
    year: 2021,
    price: 31900,
    image: '/images/car_3.jpg',
    lifestyle: 'adventure',
    lifestyleLabel: 'Wanderlust Rig',
    lifestyleDesc: 'Overland adaptability backed by legendarily efficient dual powertrains.',
    truthScore: 96,
    truthBreakdown: {
      valueRetention: 97,
      runningCosts: 93,
      reliability: 98
    },
    specs: {
      engine: '2.5L 4-Cylinder Hybrid',
      power: '219 hp',
      acceleration: '7.4s (0-100 km/h)',
      fuelEfficiency: 4.8,
      fuelType: 'hybrid',
      range: '940 km',
      transmission: 'Electronic CVT',
      driveType: 'AWD'
    },
    expenses: {
      loanPayment: 460,
      repairs: 35,
      insurance: 115,
      depreciation: 140
    },
    highlights: [
      'XSE Sport-Tuned Suspension',
      'Two-Tone Metallic Roof Paint Option',
      'Toyota Safety Sense 2.0 Dynamic Pack',
      'Thule WingBar Roof Rack System Pre-Installed'
    ],
    ownerReview: 'I regularly average 4.8 liters per 100km on active mountain runs. It is incredibly stable on loose gravel, holds its value like gold, and has never cost me a cent outside of standard oil changes.',
    seller: {
      name: 'Portland Select Toyota',
      type: 'dealer',
      rating: 4.7,
      phone: '+1 (555) 910-3320',
      location: 'Portland, OR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'
    },
    color: 'Wind Chill Pearl / Midnight Black'
  },
  {
    id: 'mazda-miata',
    make: 'Mazda',
    model: 'MX-5 Miata Club',
    year: 2020,
    price: 23800,
    image: '/images/car_4.jpg',
    lifestyle: 'speed',
    lifestyleLabel: 'Speed Therapy',
    lifestyleDesc: 'Analogue lightweight roadster built for driving purity and wind-in-hair smiles.',
    truthScore: 89,
    truthBreakdown: {
      valueRetention: 86,
      runningCosts: 88,
      reliability: 93
    },
    specs: {
      engine: '2.0L SkyActiv-G 4-Cylinder',
      power: '181 hp',
      acceleration: '5.7s (0-100 km/h)',
      fuelEfficiency: 6.9,
      fuelType: 'petrol',
      transmission: '6-Speed Manual',
      driveType: 'RWD'
    },
    expenses: {
      loanPayment: 360,
      repairs: 50,
      insurance: 125,
      depreciation: 110
    },
    highlights: [
      'Brembo Front Brakes & BBS forged wheels',
      'Bilstein Dampers & Limited Slip Differential',
      'Crisp short-throw 6-Speed Manual shifter',
      'Soft top folds down manually in 2 seconds'
    ],
    ownerReview: 'You do not need 600 horsepower to have fun. At 1,000kg, this car feels like an extension of your central nervous system. It is also surprisingly reliable and cheap to run as a weekend therapy machine.',
    seller: {
      name: 'Marcus Vance',
      type: 'private',
      rating: 4.9,
      phone: '+1 (555) 412-9901',
      location: 'San Diego, CA',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'
    },
    color: 'Soul Red Crystal Metallic'
  },
  {
    id: 'volkswagen-golf',
    make: 'Volkswagen',
    model: 'Golf TSI Style',
    year: 2021,
    price: 19500,
    image: '/images/car_5.jpg',
    lifestyle: 'pragmatic',
    lifestyleLabel: 'Daily Workhorse',
    lifestyleDesc: 'Elegant German engineering in a hyper-utilitarian package that does everything.',
    truthScore: 91,
    truthBreakdown: {
      valueRetention: 84,
      runningCosts: 92,
      reliability: 90
    },
    specs: {
      engine: '1.5L eTSI Turbocharged 4-Cyl',
      power: '150 hp',
      acceleration: '8.5s (0-100 km/h)',
      fuelEfficiency: 5.2,
      fuelType: 'petrol',
      transmission: '7-Speed DSG Automatic',
      driveType: 'FWD'
    },
    expenses: {
      loanPayment: 290,
      repairs: 55,
      insurance: 95,
      depreciation: 90
    },
    highlights: [
      'Mild Hybrid Tech with Active Cylinder Cut-off',
      'Full Digital Cockpit Pro Integration',
      'IQ.Light LED Matrix headlights with Dynamic Light Assist',
      'Spacious fold-flat cargo space up to 1,230 liters'
    ],
    ownerReview: 'It is quiet, extremely comfortable on highways, and achieves hybrid-like consumption figures (around 5L/100km) thanks to the cylinder deactivation. The perfect compromise for practical living.',
    seller: {
      name: 'Oliver Krause',
      type: 'private',
      rating: 4.6,
      phone: '+1 (555) 219-5509',
      location: 'Denver, CO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'
    },
    color: 'Oryx White Pearl'
  }
];
