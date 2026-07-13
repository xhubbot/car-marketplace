export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  image: string;
  description: string;
};

export const sampleCars: Car[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 24500,
    mileage: 18000,
    location: "New York, NY",
    image: "https://picsum.photos/id/1015/600/400",
    description: "Excellent condition, one owner."
  },
  {
    id: 2,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 38900,
    mileage: 8500,
    location: "Los Angeles, CA",
    image: "https://picsum.photos/id/1074/600/400",
    description: "Like new with Full Self-Driving."
  },
  // Add more later
];