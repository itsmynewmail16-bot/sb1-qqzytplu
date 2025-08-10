import React, { useState } from 'react';
import { ArrowLeft, Grid, List, MapPin } from 'lucide-react';
import { Item } from '../types/Item';
import ItemCard from './ItemCard';
import ClaimModal from './ClaimModal';
import Notification from './Notification';

interface FinderInterfaceProps {
  items: Item[];
  onClaimItem: (itemId: string, claimerInfo: any) => void;
  onBack: () => void;
}

const FinderInterface: React.FC<FinderInterfaceProps> = ({ items, onClaimItem, onBack }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const unclaimedItems = items.filter(item => !item.claimed);

  const handleClaimClick = (item: Item) => {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmit = (claimerInfo: any) => {
    if (selectedItem) {
      onClaimItem(selectedItem.id, claimerInfo);
      setNotification({ type: 'success', message: 'Item claimed successfully! You now have access to full details.' });
      setIsClaimModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleClaimCancel = () => {
    setIsClaimModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen py-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lost Items Near You</h1>
              <p className="text-gray-600">
                {unclaimedItems.length} item{unclaimedItems.length !== 1 ? 's' : ''} waiting to be reunited
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items Grid/List */}
        {unclaimedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Lost Items Found</h3>
            <p className="text-gray-600">There are currently no lost items reported in this area.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {unclaimedItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onClaimClick={() => handleClaimClick(item)}
              />
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Claim an Item</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>You must be within 2km of the reported location</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Answer the security question correctly</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Get access to full photos and contact details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {isClaimModalOpen && selectedItem && (
        <ClaimModal
          item={selectedItem}
          onSubmit={handleClaimSubmit}
          onCancel={handleClaimCancel}
        />
      )}

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

export default FinderInterface;