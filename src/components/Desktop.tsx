import React from 'react';

interface DesktopIconProps {
  icon: string | React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => (
  <div
    onDoubleClick={onDoubleClick}
    className="w-20 h-24 flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 group cursor-default"
  >
    <div className="w-12 h-12 flex items-center justify-center transition-transform group-active:scale-90">
      {typeof icon === 'string' ? (
        <img src={icon} alt={label} className="w-10 h-10 object-contain drop-shadow-md" />
      ) : (
        icon
      )}
    </div>
    <span className="text-white text-[11px] text-center drop-shadow-lg leading-tight line-clamp-2">
      {label}
    </span>
  </div>
);

interface DesktopProps {
  children: React.ReactNode;
  onIconDoubleClick: (id: string) => void;
  onDesktopClick?: () => void;
}

import {
  Monitor,
  Trash2,
  Terminal,
  ShieldCheck,
  FileText,
  Calculator,
  Settings as SettingsIcon,
  Database,
  RefreshCcw,
  Zap,
  Globe,
  ShoppingBag
} from 'lucide-react';

const Desktop: React.FC<DesktopProps> = ({ children, onIconDoubleClick, onDesktopClick }) => {
  const desktopIcons = [
    { id: 'explorer', label: 'This PC', icon: <Monitor className="w-8 h-8 text-blue-400" /> },
    { id: 'recycle', label: 'Recycle Bin', icon: <Trash2 className="w-8 h-8 text-gray-400" /> },
    { id: 'cmd', label: 'Command Prompt', icon: <Terminal className="w-8 h-8 text-gray-700" /> },
    { id: 'sql', label: 'SQL Terminal', icon: <Database className="w-8 h-8 text-blue-500" /> },
    { id: 'registry', label: 'Registry Editor', icon: <ShieldCheck className="w-8 h-8 text-blue-700" /> },
    { id: 'notepad', label: 'Notepad', icon: <FileText className="w-8 h-8 text-blue-300" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-8 h-8 text-blue-600" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-8 h-8 text-gray-500" /> },
    { id: 'store', label: 'Microsoft Store', icon: <ShoppingBag className="w-8 h-8 text-blue-500" /> },
    { id: 'edge', label: 'Microsoft Edge', icon: <Globe className="w-8 h-8 text-sky-500" /> },
    { id: 'build', label: 'PC Builder', icon: <Zap className="w-8 h-8 text-amber-500" /> },
    { id: 'reset', label: 'Reset PC', icon: <RefreshCcw className="w-8 h-8 text-red-500" /> },
  ];

  return (
    <div
      onClick={onDesktopClick}
      className="fixed inset-0 bg-cover bg-center transition-all duration-1000 select-none"
      style={{
        backgroundImage: `url('https://4kwallpapers.com/images/wallpapers/windows-11-bloom-dark-mode-stock-abstract-background-3840x2160-5645.jpg')`,
      }}
    >
      <div className="p-2 flex flex-col flex-wrap gap-2 h-full content-start">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onDoubleClick={() => onIconDoubleClick(icon.id)}
          />
        ))}
      </div>
      {children}
    </div>
  );
};

export default Desktop;
