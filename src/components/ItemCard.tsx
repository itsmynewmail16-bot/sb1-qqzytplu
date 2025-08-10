import React from 'react';
import { Calendar, MapPin, Eye } from 'lucide-react';
import { Item } from '../types/Item';
import { formatDate } from '../utils/helpers';

interface ItemCardProps {
  item: Item;
  viewMode: 'grid' | 'list';
  onClaimClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, viewMode, onClaimClick }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl"
            />
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.dateReported)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.images.length} photos ({item.hiddenImages.length} hidden)</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClaimClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Claim Item
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
          +{item.hiddenImages.length} hidden
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(item.dateReported)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.location.address}</span>
          </div>
        </div>
        
        <button
          onClick={onClaimClick}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Claim This Item
        </button>
      </div>
    </div>
  );
};

export default ItemCard;