'use client';

import Navbar from '../../components/Navbar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Sell() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      alert('Car listed successfully!');
      // Reset form
      setFormData({ make: '', model: '', year: '', price: '', mileage: '', location: '', description: '' });
    } else {
      alert('Error: ' + result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Sell Your Car</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Make" 
              className="border p-3 rounded-xl" 
              value={formData.make}
              onChange={(e) => setFormData({...formData, make: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Model" 
              className="border p-3 rounded-xl" 
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input 
              type="number" 
              placeholder="Year" 
              className="border p-3 rounded-xl" 
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="Price $" 
              className="border p-3 rounded-xl" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="Mileage" 
              className="border p-3 rounded-xl" 
              value={formData.mileage}
              onChange={(e) => setFormData({...formData, mileage: e.target.value})}
              required
            />
          </div>

          <input 
            type="text" 
            placeholder="Location" 
            className="border p-3 rounded-xl w-full" 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />

          <textarea 
            placeholder="Description" 
            rows={4}
            className="border p-3 rounded-xl w-full"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
            {loading ? 'Listing...' : 'List My Car'}
          </Button>
        </form>
      </div>
    </>
  );
}