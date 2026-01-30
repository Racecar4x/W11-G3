import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Bluetooth, 
  Network, 
  Settings as SettingsIcon,
  Palette,
  LayoutGrid,
  User,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';
import { db } from '../lib/db';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('System');
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    setSettings(db.getSettings());
  }, []);

  const menuItems = [
    { icon: <Monitor className="w-4 h-4" />, label: 'System' },
    { icon: <Bluetooth className="w-4 h-4" />, label: 'Bluetooth & devices' },
    { icon: <Network className="w-4 h-4" />, label: 'Network & internet' },
    { icon: <Palette className="w-4 h-4" />, label: 'Personalization' },
    { icon: <LayoutGrid className="w-4 h-4" />, label: 'Apps' },
    { icon: <User className="w-4 h-4" />, label: 'Accounts' },
    { icon: <Clock className="w-4 h-4" />, label: 'Time & language' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'Privacy & security' },
    { icon: <SettingsIcon className="w-4 h-4" />, label: 'Windows Update' },
  ];

  const updateTheme = (theme: string) => {
    db.updateSetting('theme', theme);
    setSettings({ ...settings, theme });
  };

  return (
    <div className="flex h-full bg-[#f3f3f3] select-none">
      {/* Sidebar */}
      <div className="w-64 flex flex-col p-4 gap-2">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">User</span>
            <span className="text-xs text-gray-500">Local Account</span>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Find a setting" 
            className="w-full bg-white border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-xs focus:outline-blue-600"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
                activeTab === item.label ? "bg-blue-600/10 text-blue-700 font-medium" : "hover:bg-gray-200"
              )}
            >
              <div className={cn(activeTab === item.label ? "text-blue-700" : "text-gray-600")}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white overflow-auto p-8">
        <h1 className="text-2xl font-semibold mb-8">{activeTab}</h1>

        {activeTab === 'System' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                <div className="flex items-center gap-4">
                  <Monitor className="w-6 h-6 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Display</span>
                    <span className="text-xs text-gray-500">Brightness, night light, display profile</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Sound</span>
                    <span className="text-xs text-gray-500">Volume levels, output devices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Personalization' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">Select a theme to apply</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Light', color: 'bg-white', val: 'light' },
                  { name: 'Dark', color: 'bg-slate-900', val: 'dark' },
                  { name: 'Glow', color: 'bg-purple-900', val: 'glow' },
                ].map((t) => (
                  <button
                    key={t.name}
                    onClick={() => updateTheme(t.val)}
                    className={cn(
                      "group flex flex-col gap-2 p-2 border-2 rounded-lg transition-all",
                      settings.theme === t.val ? "border-blue-600" : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <div className={cn("w-full aspect-video rounded-md shadow-sm", t.color)} />
                    <span className="text-xs font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
