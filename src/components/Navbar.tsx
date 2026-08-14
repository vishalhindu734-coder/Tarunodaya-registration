import React from 'react';
import { ActiveTab } from '../types';
import { Ticket, QrCode, Flame } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedPassesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedPassesCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100/90 shadow-xs print-hide">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo / Title */}
          <div 
            onClick={() => setActiveTab('register')}
            className="flex items-center cursor-pointer group"
          >
            <img src="./logo.png" alt="तरुणोदय उत्कर्ष युवा संगम" className="h-10 sm:h-14 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <button
              id="nav-tab-register"
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                  : 'text-slate-600 hover:text-orange-700 hover:bg-orange-50/70'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            <button
              id="nav-tab-passes"
              onClick={() => setActiveTab('passes')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'passes'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                  : 'text-slate-600 hover:text-orange-700 hover:bg-orange-50/70'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Passes</span>
              {savedPassesCount > 0 && (
                <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                  activeTab === 'passes' ? 'bg-blue-950 text-white' : 'bg-orange-100 text-orange-900'
                }`}>
                  {savedPassesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

