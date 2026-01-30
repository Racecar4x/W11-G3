import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  ChevronUp, 
  Wifi, 
  Volume2, 
  Battery,
  Folder,
  Globe,
  FileText,
  Calculator,
  Terminal,
  ShieldCheck,
  Database,
  LayoutGrid,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

interface TaskbarProps {
  onStartClick: () => void;
  onTrayClick: () => void;
  openApps: string[];
  activeApp: string | null;
  onAppClick: (appId: string) => void;
}

interface TaskbarProps {
  onStartClick: () => void;
  onTrayClick: () => void;
  openApps: string[];
  activeApp: string | null;
  onAppClick: (appId: string) => void;
  alignment?: 'center' | 'left';
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  onStartClick, 
  onTrayClick, 
  openApps, 
  activeApp, 
  onAppClick,
  alignment = 'center'
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'start', icon: <LayoutGrid className="w-6 h-6 text-blue-600 fill-blue-600" />, action: onStartClick },
    { id: 'search', icon: <Search className="w-5 h-5 text-sky-600" />, action: () => {} },
    { id: 'explorer', icon: <Folder className="w-6 h-6 text-yellow-500 fill-yellow-500" />, action: () => onAppClick('explorer') },
    { id: 'edge', icon: <Globe className="w-6 h-6 text-sky-500" />, action: () => onAppClick('edge') },
    { id: 'notepad', icon: <FileText className="w-6 h-6 text-blue-500" />, action: () => onAppClick('notepad') },
    { id: 'calculator', icon: <Calculator className="w-6 h-6 text-blue-600" />, action: () => onAppClick('calculator') },
    { id: 'cmd', icon: <Terminal className="w-6 h-6 text-gray-800" />, action: () => onAppClick('cmd') },
    { id: 'registry', icon: <ShieldCheck className="w-6 h-6 text-blue-700" />, action: () => onAppClick('registry') },
    { id: 'sql', icon: <Database className="w-6 h-6 text-blue-400" />, action: () => onAppClick('sql') },
    { id: 'settings', icon: <SettingsIcon className="w-6 h-6 text-gray-600" />, action: () => onAppClick('settings') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-xl border-t border-white/20 flex items-center justify-between px-3 z-[1000] select-none">
      <div className={cn(alignment === 'center' ? "flex-1" : "hidden")} />
      
      <div className={cn("flex items-center gap-1", alignment === 'left' && "flex-1 justify-start")}>
        {apps.map((app) => {
          const isOpen = openApps.includes(app.id);
          const isActive = activeApp === app.id;
          
          return (
            <div
              key={app.id}
              onClick={app.action}
              className={cn(
                "group relative h-10 w-10 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-white/50 cursor-default",
                isActive && "bg-white/40"
              )}
            >
              {app.icon}
              {isOpen && (
                <div className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-blue-500 transition-all duration-200",
                  isActive ? "w-4" : "w-1 group-hover:w-2"
                )} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex justify-end items-center gap-1">
        <div className="hover:bg-white/50 rounded p-1.5 transition-colors cursor-default">
          <ChevronUp className="w-4 h-4" />
        </div>
        
        <div 
          onClick={onTrayClick}
          className="flex items-center gap-2 hover:bg-white/50 rounded px-2 py-1 transition-colors cursor-default group"
        >
          <Wifi className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>

        <div className="flex flex-col items-end hover:bg-white/50 rounded px-2 py-0.5 transition-colors cursor-default">
          <span className="text-xs font-medium">{format(time, 'h:mm a')}</span>
          <span className="text-[10px]">{format(time, 'MM/dd/yyyy')}</span>
        </div>

        <div className="w-1 border-l border-gray-400 h-3 ml-1" />
        <div className="w-1.5 h-full hover:bg-white/50" />
      </div>
    </div>
  );
};

export default Taskbar;
