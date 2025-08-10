import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Item } from '../types/Item';
import { getCurrentLocation, getAddressFromCoords } from '../utils/location';
import { generateId } from '../utils/helpers';
import Notification from './Notification';

interface ReporterInterfaceProps {
  onAddItem: (item: Item) => void;
  onBack: () => void;
}

const ReporterInterface: React.FC<ReporterInterfaceProps> = ({ onAddItem, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      const address = await getAddressFromCoords(coords.latitude, coords.longitude);
      setLocation({ ...coords, address });
      setNotification({ type: 'success', message: 'Location detected successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to get location. Please enable location services.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      setNotification({ type: 'error', message: 'Please fetch your location first.' });
      return;
    }

    if (images.length === 0) {
      setNotification({ type: 'error', message: 'Please upload at least one image.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const visibleImages = images.slice(0, Math.ceil(images.length / 2));
      const hiddenImages = images.slice(Math.ceil(images.length / 2));

      const newItem: Item = {
        id: generateId(),
        name: formData.name,
        description: formData.description,
        images: visibleImages,
        hiddenImages,
        video,
        location,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer.toLowerCase().trim(),
        dateReported: new Date().toISOString(),
        claimed: false
      };

      onAddItem(newItem);
      setNotification({ type: 'success', message: 'Lost item reported successfully! Others can now help you find it.' });
      
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to report item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Lost Item</h1>
            <p className="text-gray-600">Help others help you find your lost belongings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., iPhone 13, Blue Backpack, Car Keys"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your item in detail..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Photos & Video</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos * (Some will be hidden for security)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">Upload photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        {index >= Math.ceil(images.length / 2) && (
                          <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Hidden
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">Upload video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-1">MP4, MOV up to 50MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
            
            <button
              type="button"
              onClick={fetchLocation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>{location ? 'Update Location' : 'Get Current Location'}</span>
            </button>
            
            {location && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Location detected</span>
                </div>
                <p className="text-green-600 text-sm mt-1">{location.address}</p>
              </div>
            )}
          </div>

          {/* Security Question */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Security Verification</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Question *
                </label>
                <input
                  type="text"
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., What's the brand inside the wallet? What color is the phone case?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter the correct answer"
                  required
                />
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-orange-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Important</span>
                </div>
                <p className="text-orange-600 text-sm mt-1">
                  Only people who answer this question correctly can claim your item and see the hidden photos.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Reporting Item...' : 'Report Lost Item'}
          </button>
        </form>
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

export default ReporterInterface;