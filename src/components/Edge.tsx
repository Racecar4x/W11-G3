import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Shield, 
  Globe,
  Database,
  FileText
} from 'lucide-react';

const Edge: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://www.bing.com');

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Navigating to:', inputUrl);
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] select-none">
      {/* Tabs */}
      <div className="h-10 flex items-center px-2 gap-1 bg-[#dde4eb]">
        <div className="flex items-center bg-white px-3 py-1.5 rounded-t-lg gap-2 text-xs w-48 shadow-sm">
          <Shield className="w-3 h-3 text-blue-600" />
          <span className="truncate">New Tab</span>
          <Plus className="w-3 h-3 ml-auto text-gray-400" />
        </div>
        <button className="p-1.5 hover:bg-white/50 rounded-md transition-colors">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Address Bar */}
      <div className="h-12 border-b flex items-center px-4 gap-4 bg-white">
        <div className="flex gap-2 text-gray-600">
          <ArrowLeft className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
          <ArrowRight className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
          <RotateCw className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
          <Home className="w-4 h-4 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
        </div>
        
        <form onSubmit={handleGo} className="flex-1 max-w-4xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Shield className="w-3 h-3 text-green-600" />
          </div>
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-[#f0f2f5] border border-transparent rounded-full py-1.5 pl-9 pr-10 text-xs focus:bg-white focus:border-blue-500 transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </form>

        <div className="flex gap-2 text-gray-600">
          <MoreHorizontal className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">U</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {inputUrl.includes('google.com') ? (
           <div className="w-full h-full flex flex-col items-center pt-24 bg-white">
             <h1 className="text-6xl font-bold mb-8">
               <span className="text-blue-500">G</span>
               <span className="text-red-500">o</span>
               <span className="text-yellow-500">o</span>
               <span className="text-blue-500">g</span>
               <span className="text-green-500">l</span>
               <span className="text-red-500">e</span>
             </h1>
             <div className="w-full max-w-xl relative">
               <input type="text" className="w-full border border-gray-200 rounded-full py-3 px-6 shadow-sm hover:shadow-md focus:outline-none transition-shadow" placeholder="Search Google or type a URL" />
               <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             </div>
             <div className="flex gap-4 mt-8">
               <button className="bg-gray-50 px-4 py-2 text-sm rounded hover:border-gray-300 border border-transparent">Google Search</button>
               <button className="bg-gray-50 px-4 py-2 text-sm rounded hover:border-gray-300 border border-transparent">I'm Feeling Lucky</button>
             </div>
           </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center">
            <div className="w-24 h-24 mb-8 bg-gradient-to-tr from-sky-600 to-teal-400 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12">
               <Globe className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Microsoft Edge</h2>
            <p className="text-gray-500 max-w-md mb-12 text-sm">Experience the web powered by the world's most advanced SQL database engine.</p>
            
            <div className="grid grid-cols-4 gap-6 max-w-3xl w-full">
              {[
                { name: 'Microsoft 365', icon: <Plus className="w-8 h-8 text-orange-500" />, color: 'bg-orange-50' },
                { name: 'Outlook', icon: <RotateCw className="w-8 h-8 text-blue-600" />, color: 'bg-blue-50' },
                { name: 'Azure SQL', icon: <Database className="w-8 h-8 text-sky-700" />, color: 'bg-sky-50' },
                { name: 'GitHub', icon: <Home className="w-8 h-8 text-gray-800" />, color: 'bg-gray-100' },
                { name: 'Bing', icon: <Search className="w-8 h-8 text-blue-500" />, color: 'bg-blue-50' },
                { name: 'Xbox', icon: <Globe className="w-8 h-8 text-green-600" />, color: 'bg-green-50' },
                { name: 'News', icon: <FileText className="w-8 h-8 text-red-500" />, color: 'bg-red-50' },
                { name: 'Support', icon: <Shield className="w-8 h-8 text-purple-600" />, color: 'bg-purple-50' },
              ].map(site => (
                <div key={site.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className={`w-16 h-16 ${site.color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    {site.icon}
                  </div>
                  <span className="text-[11px] font-medium text-gray-600">{site.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edge;
