import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="text-6xl font-bold mb-6">
              Find Your Dream Car
            </h1>
            <p className="text-xl mb-10">
              Buy and sell cars easily. Thousands of vehicles waiting for you.
            </p>
            <button className="bg-white text-blue-700 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100">
              Browse Cars
            </button>
          </div>
        </div>

        <div className="text-center py-12 text-gray-500">
          Home Page - More coming soon...
        </div>
      </main>
    </>
  );
}