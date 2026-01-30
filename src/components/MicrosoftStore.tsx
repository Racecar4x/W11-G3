import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Gamepad2, 
  MonitorPlay, 
  Download, 
  Star,
  CheckCircle2,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';

const MicrosoftStore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [installingApp, setInstallingApp] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<string[]>([]);

  const apps = [
    { id: 'whatsapp', name: 'WhatsApp', category: 'Productivity', icon: <Package className="text-green-500" />, rating: 4.5, size: '120 MB' },
    { id: 'netflix', name: 'Netflix', category: 'Entertainment', icon: <MonitorPlay className="text-red-500" />, rating: 4.8, size: '85 MB' },
    { id: 'roblox', name: 'Roblox', category: 'Games', icon: <Gamepad2 className="text-gray-800" />, rating: 4.2, size: '420 MB' },
    { id: 'spotify', name: 'Spotify', category: 'Music', icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold italic">S</div>, rating: 4.7, size: '95 MB' },
    { id: 'vscode', name: 'VS Code', category: 'Developer Tools', icon: <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">V</div>, rating: 4.9, size: '210 MB' }
  ];

  const handleInstall = (id: string) => {
    setInstallingApp(id);
    setTimeout(() => {
      setInstallingApp(null);
      setInstalledApps([...installedApps, id]);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] text-gray-800 select-none overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-1">
        <div className="w-16 bg-[#eeeeee] flex flex-col items-center py-8 gap-8 border-r">
          {[
            { id: 'Home', icon: <ShoppingBag className="w-5 h-5" /> },
            { id: 'Apps', icon: <Package className="w-5 h-5" /> },
            { id: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
            { id: 'Movies', icon: <MonitorPlay className="w-5 h-5" /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
              title={tab.id}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-14 flex items-center px-8 justify-between border-b bg-white/50 backdrop-blur-md">
            <h1 className="font-semibold">{activeTab}</h1>
            <div className="relative w-96">
              <input 
                type="text" 
                placeholder="Search apps, games, movies, and more" 
                className="w-full bg-white border rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-400 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Apps Grid */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* Banner */}
            <div className="w-full h-64 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl mb-12 p-12 text-white flex flex-col justify-center shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Featured</span>
                <h2 className="text-4xl font-bold mt-4 mb-2">Powering the Future</h2>
                <p className="text-blue-100 max-w-md text-sm">Download the latest AI tools optimized for Gemini 3 Flash execution.</p>
                <button className="mt-8 bg-white text-blue-700 px-6 py-2 rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors">Learn More</button>
              </div>
              <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>

            <h3 className="text-xl font-semibold mb-6">Top Free Apps</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {apps.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:shadow-xl transition-all group flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                    {app.icon}
                  </div>
                  <div className="font-semibold text-sm">{app.name}</div>
                  <div className="text-[10px] text-gray-500 mb-3">{app.category}</div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold">{app.rating}</span>
                  </div>

                  <button 
                    onClick={() => handleInstall(app.id)}
                    disabled={installedApps.includes(app.id) || installingApp === app.id}
                    className={`w-full py-1.5 rounded-full text-xs font-semibold transition-all ${
                      installedApps.includes(app.id) 
                        ? 'bg-gray-100 text-green-600 flex items-center justify-center gap-2 cursor-default'
                        : installingApp === app.id
                          ? 'bg-blue-50 text-blue-600 animate-pulse'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md'
                    }`}
                  >
                    {installedApps.includes(app.id) ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Installed</span>
                      </>
                    ) : installingApp === app.id ? (
                      'Installing...'
                    ) : (
                      'Get'
                    )}
                  </button>
                  <div className="mt-2 text-[9px] text-gray-400">In-app purchases</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrosoftStore;
