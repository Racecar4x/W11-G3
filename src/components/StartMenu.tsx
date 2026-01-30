import React from 'react';
import { Search, ChevronRight, Power, User, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartMenuProps {
  isOpen: boolean;
  onAppClick: (appId: string) => void;
}

import { 
  Globe, 
  FileText, 
  Database, 
  Terminal, 
  Settings as SettingsIcon, 
  Calculator, 
  Folder, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Image as ImageIcon,
  ShieldCheck,
  Layout
} from 'lucide-react';

const pinnedApps = [
  { id: 'edge', name: 'Edge', icon: <Globe className="w-6 h-6 text-sky-500" /> },
  { id: 'word', name: 'Word', icon: <FileText className="w-6 h-6 text-blue-600" /> },
  { id: 'excel', name: 'Excel', icon: <Layout className="w-6 h-6 text-green-600" /> },
  { id: 'mail', name: 'Mail', icon: <Mail className="w-6 h-6 text-blue-400" /> },
  { id: 'calendar', name: 'Calendar', icon: <Calendar className="w-6 h-6 text-orange-500" /> },
  { id: 'store', name: 'Store', icon: <ShoppingBag className="w-6 h-6 text-blue-500" /> },
  { id: 'photos', name: 'Photos', icon: <ImageIcon className="w-6 h-6 text-purple-500" /> },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon className="w-6 h-6 text-gray-500" /> },
  { id: 'calculator', name: 'Calculator', icon: <Calculator className="w-6 h-6 text-blue-600" /> },
  { id: 'notepad', name: 'Notepad', icon: <FileText className="w-6 h-6 text-blue-300" /> },
  { id: 'explorer', name: 'Explorer', icon: <Folder className="w-6 h-6 text-yellow-500" /> },
  { id: 'sql', name: 'SQL Terminal', icon: <Database className="w-6 h-6 text-blue-500" /> },
  { id: 'cmd', name: 'Terminal', icon: <Terminal className="w-6 h-6 text-gray-800" /> },
  { id: 'registry', name: 'Registry', icon: <ShieldCheck className="w-6 h-6 text-blue-700" /> },
  { id: 'reset', name: 'Reset PC', icon: <RefreshCw className="w-6 h-6 text-red-500" /> },
];

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onAppClick }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 500, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[540px] h-[600px] bg-white/85 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl z-[900] overflow-hidden flex flex-col"
        >
          {/* Search Bar */}
          <div className="p-8 pb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Type to search"
                className="w-full bg-white border-b-2 border-blue-600 px-10 py-2 text-sm focus:outline-none shadow-sm rounded-t-sm"
              />
            </div>
          </div>

          {/* Pinned Section */}
          <div className="flex-1 px-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Pinned</span>
              <button className="flex items-center text-xs bg-white/50 px-2 py-1 rounded shadow-sm hover:bg-white transition-colors">
                All apps <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-6 gap-y-4">
              {pinnedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onAppClick(app.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-md group-hover:bg-white/50 transition-colors">
                    {typeof app.icon === 'string' ? (
                      <img src={app.icon} alt={app.name} className="w-8 h-8" />
                    ) : (
                      app.icon
                    )}
                  </div>
                  <span className="text-[11px] text-center w-full truncate px-1">{app.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold">Recommended</span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <p className="text-xs italic">No recently opened files</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-16 bg-black/5 border-t border-black/5 flex items-center justify-between px-10">
            <div className="flex items-center gap-3 hover:bg-white/50 p-2 rounded-md transition-colors cursor-default">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">User</span>
            </div>
            <div className="relative group/power">
              <button className="p-2 hover:bg-white/50 rounded-md transition-colors">
                <Power className="w-5 h-5" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white shadow-2xl rounded-lg border border-gray-200 hidden group-hover/power:block z-[1001] py-1 overflow-hidden">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100 flex items-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restart
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('system:recovery'))}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100 flex items-center gap-3 text-amber-600 font-medium"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Advanced Startup (Recovery)
                </button>
                <button 
                  onClick={(e) => {
                    if (e.shiftKey) {
                      window.dispatchEvent(new CustomEvent('system:recovery'));
                    } else {
                       window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100 flex items-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restart
                </button>
                <button className="w-full px-4 py-2 text-left text-xs hover:bg-gray-100 flex items-center gap-3">
                  <Power className="w-4 h-4" />
                  Shut down
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;
