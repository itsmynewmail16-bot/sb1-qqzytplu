import React, { useState, useEffect } from 'react';
import { X, MapPin, Lock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Item } from '../types/Item';
import { getCurrentLocation, calculateDistance } from '../utils/location';
import Notification from './Notification';

interface ClaimModalProps {
  item: Item;
  onSubmit: (claimerInfo: any) => void;
  onCancel: () => void;
}

const ClaimModal: React.FC<ClaimModalProps> = ({ item, onSubmit, onCancel }) => {
  const [answer, setAnswer] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          item.location.latitude,
          item.location.longitude
        );
        
        const withinRange = distance <= 2; // 2km radius
        setIsWithinRange(withinRange);
        
        if (!withinRange) {
          setNotification({
            type: 'error',
            message: `You are ${distance.toFixed(1)}km away. You must be within 2km to claim this item.`
          });
        }
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Unable to verify your location. Please enable location services.'
        });
      } finally {
        setIsCheckingLocation(false);
      }
    };

    checkLocation();
  }, [item.location]);

  const handleAnswerSubmit = () => {
    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = item.securityAnswer.toLowerCase().trim();
    
    if (userAnswer === correctAnswer) {
      setIsVerified(true);
      setNotification({ type: 'success', message: 'Correct answer! You can now see all details.' });
    } else {
      setNotification({ type: 'error', message: 'Incorrect answer. Please try again.' });
      setAnswer('');
    }
  };

  const handleFinalSubmit = () => {
    onSubmit({
      claimedAt: new Date().toISOString(),
      location: currentLocation
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Claim Item</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Check */}
          <div className="mb-6 p-4 rounded-xl border">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Location Verification</h4>
            </div>
            
            {isCheckingLocation ? (
              <p className="text-gray-600">Checking your location...</p>
            ) : isWithinRange ? (
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">You are within the required 2km radius</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">You are too far from the reported location</span>
              </div>
            )}
          </div>

          {/* Security Question */}
          {isWithinRange && !isVerified && (
            <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50">
              <div className="flex items-center space-x-2 mb-3">
                <Lock className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">Security Question</h4>
              </div>
              
              <p className="text-gray-700 mb-4 font-medium">{item.securityQuestion}</p>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-grow px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                />
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!answer.trim()}
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Revealed Content */}
          {isVerified && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <h4 className="font-semibold">Verification Successful!</h4>
              </div>
              
              {/* All Images */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <h5 className="font-medium text-gray-800">All Photos</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...item.images, ...item.hiddenImages].map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Item ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Video */}
              {item.video && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-3">Video</h5>
                  <video
                    src={item.video}
                    controls
                    className="w-full rounded-xl max-h-64"
                  />
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h5 className="font-semibold text-green-800 mb-2">Next Steps</h5>
                <p className="text-green-700 text-sm">
                  Contact the owner to arrange pickup. Make sure to verify the item details in person before completing the exchange.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {isVerified && (
              <button
                onClick={handleFinalSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Confirm Claim
              </button>
            )}
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ClaimModal;