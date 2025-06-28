
import React, { useState } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  available: boolean;
}

const locations: Location[] = [
  { id: 'maharashtra', name: 'Mumbai', x: 300, y: 380, available: true },
  { id: 'goa', name: 'Goa', x: 280, y: 450, available: true },
];

interface IndiaMapProps {
  onLocationSelect: (location: string) => void;
}

const IndiaMap = ({ onLocationSelect }: IndiaMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const handleLocationClick = (locationId: string) => {
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
          Explore India's rich knowledge heritage. Select your region to begin your learning journey through our interactive quiz platform.
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-orange-100 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-50 rounded-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="relative inline-block">
              <img 
                src="https://brainybearstore.com/cdn/shop/files/indiamap-1.jpg?v=1732182627"
                alt="India Map"
                className="w-full h-auto max-w-2xl mx-auto rounded-2xl shadow-lg"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
              
              {/* Location markers */}
              {locations.map((location) => (
                <div key={location.id} className="absolute">
                  {/* Glow effect for selected location */}
                  {selectedLocation === location.id && (
                    <div
                      className="absolute w-8 h-8 bg-orange-400 rounded-full opacity-40 animate-pulse"
                      style={{
                        left: `${(location.x / 500) * 100}%`,
                        top: `${(location.y / 600) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                  
                  {/* Main marker */}
                  <div
                    className={`absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 border-2 border-white shadow-lg ${
                      selectedLocation === location.id ? 'bg-orange-500' : 'bg-blue-600'
                    } ${hoveredLocation === location.id ? 'scale-110' : ''}`}
                    style={{
                      left: `${(location.x / 500) * 100}%`,
                      top: `${(location.y / 600) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleLocationClick(location.id)}
                    onMouseEnter={() => setHoveredLocation(location.id)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  />
                  
                  {/* Location label */}
                  <div
                    className="absolute px-3 py-1 bg-white rounded-lg shadow-md border cursor-pointer"
                    style={{
                      left: `${(location.x / 500) * 100}%`,
                      top: `${(location.y / 600) * 100 - 8}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                    onClick={() => handleLocationClick(location.id)}
                  >
                    <span className={`text-sm font-semibold ${
                      selectedLocation === location.id ? 'text-orange-600' : 'text-gray-800'
                    }`}>
                      {location.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced location selection card */}
        {selectedLocation && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="bg-gradient-to-r from-white to-orange-50 rounded-2xl shadow-xl p-8 border-l-4 border-orange-400 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-navy-800">
                    {locations.find(l => l.id === selectedLocation)?.name}
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

      {/* Floating instruction */}
      {!selectedLocation && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
            <MapPin className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-gray-700 font-medium">Click on a highlighted region to start</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
