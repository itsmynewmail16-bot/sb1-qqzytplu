import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ReporterInterface from './components/ReporterInterface';
import FinderInterface from './components/FinderInterface';
import { Item } from './types/Item';
import { loadItems, saveItems } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'reporter' | 'finder'>('landing');
  const [items, setItems] = useState<Item[]>(() => loadItems());

  const handleAddItem = (item: Item) => {
    const updatedItems = [...items, item];
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const handleClaimItem = (itemId: string, claimerInfo: any) => {
    const updatedItems = items.map(item => 
      item.id === itemId 
        ? { ...item, claimed: true, claimerInfo }
        : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {currentView === 'landing' && (
        <LandingPage
          onReportClick={() => setCurrentView('reporter')}
          onFindClick={() => setCurrentView('finder')}
        />
      )}
      
      {currentView === 'reporter' && (
        <ReporterInterface
          onAddItem={handleAddItem}
          onBack={handleBackToHome}
        />
      )}
      
      {currentView === 'finder' && (
        <FinderInterface
          items={items}
          onClaimItem={handleClaimItem}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;