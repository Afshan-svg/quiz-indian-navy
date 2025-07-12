import React, { useState, useEffect } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  location: string;
}

interface IndiaMapProps {
  onLocationSelect: (location: string) => void;
}

const IndiaMap = ({ onLocationSelect }: IndiaMapProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data);
        setError(null);
      } catch (err) {
        setError('Error loading locations. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleProceed = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <Compass className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            भारत Quiz Vista
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore India's rich knowledge heritage. Select a region from the table to begin your learning journey through our interactive quiz platform.
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Map Image (Static, for context) */}
        <div className="md:w-1/2">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-orange-100 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-50 rounded-3xl opacity-50"></div>
            <div className="relative z-10">
              <img
                src="https://brainybearstore.com/cdn/shop/files/indiamap-1.jpg?v=1732182627"
                alt="India Map"
                className="w-full h-auto max-h-[600px] rounded-2xl shadow-lg"
                style={{ objectFit: 'contain' }}
                onError={() => console.error('Map image failed to load')}
              />
            </div>
          </div>
        </div>

        {/* Location Selection Table */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-50 rounded-3xl opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-navy-800 mb-4">Select a Region</h2>
              {loading ? (
                <p className="text-gray-600">Loading locations...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="py-3 px-4 text-gray-700 font-semibold">Region</th>
                      <th className="py-3 px-4 text-gray-700 font-semibold">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 text-gray-800 font-medium">{location.location}</td>
                        <td className="py-3 px-4">
                          <input
                            type="radio"
                            name="location"
                            value={location.id}
                            checked={selectedLocation === location.id}
                            onChange={() => handleLocationSelect(location.id)}
                            className="h-5 w-5 text-orange-500 focus:ring-orange-400"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Enhanced location selection card */}
          {selectedLocation && !loading && !error && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="bg-gradient-to-r from-white to-orange-50 rounded-2xl shadow-xl p-8 border-l-4 border-orange-400 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-navy-800">
                      {locations.find((l) => l.id === selectedLocation)?.location}
                    </h3>
                    <p className="text-orange-600 font-medium">Region Selected</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 mb-6 border border-orange-100">
                  <p className="text-gray-600 leading-relaxed">
                    Ready to explore quizzes from this beautiful region? Discover the rich cultural heritage,
                    history, and knowledge that this area has to offer through our interactive learning platform.
                  </p>
                </div>
                <Button
                  onClick={handleProceed}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Begin Your Journey
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating instruction */}
      {!selectedLocation && !loading && !error && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
            <MapPin className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-gray-700 font-medium">Select a region from the table to start</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaMap;