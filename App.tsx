
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TabPage from './components/TabPage';
import Navbar from './components/Navbar';
import SearchOverlay from './components/SearchOverlay';

export type TabID = 'home' | 'standings' | 'schedule' | 'stats' | 'legacy' | 'rules' | 'more' | 'college' | 'rosters' | 'applications' | 'partner-hub' | 'hall-of-fame' | 'league-history' | string;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabID>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Manage body class for the College and Hall of Fame themes
  useEffect(() => {
    // Reset classes
    document.body.classList.remove('theme-college', 'theme-hof');
    
    if (activeTab === 'college') {
      document.body.classList.add('theme-college');
    } else if (activeTab === 'hall-of-fame') {
      document.body.classList.add('theme-hof');
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      {/* Persistent Search Overlay controlled at App level */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectTab={setActiveTab}
      />

      {/* Persistent Navbar across all views */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSearchTrigger={() => setIsSearchOpen(true)} 
      />

      {activeTab === 'home' ? (
        <LandingPage 
          onSearchTrigger={() => setIsSearchOpen(true)}
          onTabChange={setActiveTab}
        />
      ) : (
        <TabPage 
          tabId={activeTab} 
          onBack={() => setActiveTab('home')} 
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default App;
