export interface CarSpecs {
  engine: string;
  power: string;
  acceleration: string;
  fuelEfficiency: number; // L/100km for hybrid/petrol, kWh/100km for electric
  fuelType: 'electric' | 'hybrid' | 'petrol';
  range?: string;
  transmission: string;
  driveType: string;
}

export interface CarExpenses {
  loanPayment: number; // Base monthly finance
  repairs: number; // Average monthly maintenance/repairs
  insurance: number; // Average monthly insurance
  depreciation: number; // Monthly loss of value over 3 years
}

export interface SellerInfo {
  name: string;
  type: 'private' | 'dealer';
  rating: number;
  phone: string;
  location: string;
  avatar: string;
}

export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  lifestyle: 'commute' | 'adventure' | 'speed' | 'pragmatic';
  lifestyleLabel: string;
  lifestyleDesc: string;
  truthScore: number;
  truthBreakdown: {
    valueRetention: number;
    runningCosts: number;
    reliability: number;
  };
  specs: CarSpecs;
  expenses: CarExpenses;
  highlights: string[];
  ownerReview: string;
  seller: SellerInfo;
  color: string;
}

export type ViewMode = 'standard' | 'ownership';
