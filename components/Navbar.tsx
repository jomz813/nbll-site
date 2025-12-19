import React, { useState } from 'react';
import { TabID } from '../App';

interface NavbarProps {
  activeTab: TabID;
  onTabChange: (tabId: TabID) => void;
  onSearchTrigger: () => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  duration: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onSearchTrigger }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const isCollege = activeTab === 'college';
  const isHOF = activeTab === 'hall-of-fame';
  const isHome = activeTab === 'home';
  
  // Theme-aware colors
  const accentBg = isHOF ? 'bg-[#D4AF37]' : (isCollege ? 'bg-[#0EA5E9]' : 'bg-[#D60A07]');
  const accentText = isHOF ? 'text-[#D4AF37]' : (isCollege ? 'text-[#0EA5E9]' : 'text-[#D60A07]');
  const accentBorder = isHOF ? 'border-[#D4AF37]/50' : (isCollege ? 'border-[#0EA5E9]/50' : 'border-[#D60A07]/30');
  const accentShadow = isHOF 
    ? 'shadow-[0_4px_12px_rgba(212,175,55,0.2)]' 
    : (isCollege ? 'shadow-[0_4px_12px_rgba(14,165,233,0.2)]' : 'shadow-[0_4px_12px_rgba(214,10,7,0.2)]');

  const tabs: { name: TabID; label: string }[] = [
    { name: 'home', label: 'home' },
    { name: 'standings', label: 'standings' },
    { name: 'schedule', label: 'schedule' },
    { name: 'stats', label: 'stats' },
    { name: 'legacy', label: 'legacy' },
    { name: 'more', label: 'more' }
  ];

  const getParentTab = (tabId: TabID): TabID => {
    if (typeof tabId === 'string' && tabId.startsWith('team-')) return 'more';
    
    const parentMap: Partial<Record<TabID, TabID>> = {
      'college': 'more',
      'rosters': 'more',
      'applications': 'more',
      'partner-hub': 'more',
      'rules': 'more',
      'hall-of-fame': 'legacy',
      'league-history': 'legacy'
    };
    return parentMap[tabId] || tabId;
  };

  const handleTabClick = (tabId: TabID) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  const triggerBurst = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 150);

    const count = 20 + Math.floor(Math.random() * 11); // 20-30 particles
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        size: 6 + Math.random() * 5, // 6-10px
        color: isHOF ? '#D4AF37' : (Math.random() > 0.3 ? '#D60A07' : (Math.random() > 0.5 ? '#E4E4E7' : '#FFFFFF')),
        duration: 800 + Math.random() * 400 // 800-1200ms
      };
    });

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1250);
  };

  const handleLogoClick = () => {
    if (isHome) {
      triggerBurst();
    } else {
      handleTabClick('home');
    }
  };

  const isTabActive = (tabName: TabID) => {
    return getParentTab(activeTab) === tabName;
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[80] w-full max-w-[1200px] px-6">
      <div className={`relative bg-gradient-to-b from-white via-white/98 to-zinc-100/95 backdrop-blur-2xl border ${accentBorder} rounded-full h-16 flex items-center justify-between px-8 shadow-[0_45px_100px_-15px_rgba(0,0,0,0.65)]`}>
        <div className="relative flex items-center justify-center">
          <button 
            onClick={handleLogoClick}
            className={`${accentText} text-2xl font-black tracking-tighter transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shrink-0 relative z-10 ${isPopping ? 'scale-105' : ''}`}
          >
            nbll
          </button>
          
          <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
            {particles.map(p => (
              <div 
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animation: `particle-burst ${p.duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-center px-4">
          {tabs.map((tab) => {
            const active = isTabActive(tab.name);
            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={`
                  text-sm font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 tracking-wide whitespace-nowrap relative py-1
                  ${active ? accentText : 'text-zinc-500 hover:text-zinc-800'}
                `}
              >
                {tab.label}
                {active && (
                  <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${accentBg} rounded-full animate-pulse`} />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center shrink-0">
          <div 
            onClick={onSearchTrigger}
            className={`group relative ${accentBg} rounded-full flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 ${accentShadow}`}
          >
            <svg 
              className="w-3.5 h-3.5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              readOnly 
              placeholder="search" 
              className="bg-transparent border-none outline-none text-white text-[11px] font-black placeholder-white/90 w-12 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex md:hidden flex-1 justify-end items-center gap-4">
          <button 
            onClick={onSearchTrigger}
            className={`p-2 ${accentBg} text-white rounded-full shadow-lg scale-90`}
          >
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${accentText} p-2 rounded-full hover:bg-zinc-100 transition-all active:scale-90`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            )}
          </button>
        </div>

        <div className={`
          absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-3xl border border-zinc-200 rounded-[2.5rem] p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-16 scale-[0.9] pointer-events-none'}
        `}>
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const active = isTabActive(tab.name);
              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`
                    text-lg font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wide py-4 px-8 rounded-2xl flex items-center justify-between
                    ${active 
                      ? `text-white ${accentBg} shadow-xl scale-[1.03]` 
                      : `${accentText} hover:bg-zinc-50`
                    }
                  `}
                >
                  {tab.label}
                  {active && (
                    <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;