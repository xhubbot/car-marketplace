import Navbar from '@/components/Navbar';
import prisma from '@/lib/prisma';

export default async function Browse() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Browse Cars</h1>
          <p className="text-gray-600">{cars.length} cars available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
              {car.image && (
                <img 
                  src={car.image} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{car.make} {car.model}</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${car.price.toLocaleString()}
                </p>
                
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>{car.year} • {car.mileage.toLocaleString()} miles</p>
                  <p>{car.location}</p>
                </div>

                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}