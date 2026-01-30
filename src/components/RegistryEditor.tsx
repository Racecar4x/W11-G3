import React, { useState, useEffect } from 'react';
import { Database, Folder, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import { db } from '../lib/db';

const RegistryEditor: React.FC = () => {
  const [registry, setRegistry] = useState<any[]>([]);
  const [selectedPath] = useState('HKEY_LOCAL_MACHINE\\SYSTEM');

  const loadRegistry = async () => {
    const data = await db.query('SELECT * FROM registry');
    setRegistry(data);
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  const triggerBSOD = () => {
    // We'll communicate this to App.tsx via a custom event or a shared state if we had context
    // For now, let's use a custom event.
    window.dispatchEvent(new CustomEvent('system:bsod', { 
      detail: { code: 'CRITICAL_PROCESS_DIED', message: 'Registry service terminated unexpectedly.' } 
    }));
  };

  const deleteKey = async (id: number) => {
    if (confirm('Are you sure you want to delete this registry key? System instability may occur.')) {
      await db.query(`DELETE FROM registry WHERE id = ${id}`);
      loadRegistry();
      if (registry.find(r => r.id === id)?.key === 'ServiceManager') {
        setTimeout(triggerBSOD, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] select-none text-xs">
      {/* Toolbar */}
      <div className="h-10 border-b flex items-center px-4 gap-4 bg-white">
        <div className="flex gap-4 text-gray-700">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Favorites</span>
          <span>Help</span>
        </div>
      </div>
      
      <div className="h-8 border-b flex items-center px-3 bg-[#f3f3f3]">
        <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-0.5 flex items-center gap-2">
          <span>Computer\{selectedPath}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tree view */}
        <div className="w-64 border-r bg-white overflow-auto p-2">
          <div className="flex items-center gap-1 py-1 px-1 hover:bg-blue-50 cursor-default">
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Computer</span>
          </div>
          <div className="ml-4">
             {['HKEY_CLASSES_ROOT', 'HKEY_CURRENT_USER', 'HKEY_LOCAL_MACHINE', 'HKEY_USERS', 'HKEY_CURRENT_CONFIG'].map(root => (
               <div key={root} className="flex items-center gap-1 py-1 px-1 hover:bg-blue-50 cursor-default">
                 <ChevronRight className="w-3 h-3 text-gray-400" />
                 <Folder className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                 <span>{root}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Values view */}
        <div className="flex-1 bg-white overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-2 font-normal border-r text-gray-500">Name</th>
                <th className="text-left px-4 py-2 font-normal border-r text-gray-500">Type</th>
                <th className="text-left px-4 py-2 font-normal text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-blue-50 border-b">
                <td className="px-4 py-1.5">(Default)</td>
                <td className="px-4 py-1.5 text-gray-400">REG_SZ</td>
                <td className="px-4 py-1.5 text-gray-400">(value not set)</td>
              </tr>
              {registry.map((reg) => (
                <tr 
                  key={reg.id} 
                  className="hover:bg-blue-50 border-b group"
                  onDoubleClick={() => deleteKey(reg.id)}
                >
                  <td className="px-4 py-1.5 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-gray-400" />
                    {reg.key}
                  </td>
                  <td className="px-4 py-1.5 text-gray-400">{reg.type}</td>
                  <td className="px-4 py-1.5 flex justify-between items-center">
                    <span>{reg.value}</span>
                    <button 
                      onClick={() => deleteKey(reg.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-8 flex flex-col items-center gap-4 border-t mt-8 bg-slate-900 text-white">
            <Shield className="w-12 h-12 text-blue-400" />
            <div className="text-center">
              <h3 className="font-bold text-lg text-blue-400">Windows Tweak & Mod Station</h3>
              <p className="text-gray-400 mt-1 text-sm">Experimental modifications for system enthusiasts.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <button 
                onClick={() => {
                   db.query("UPDATE registry SET value = 'Disabled' WHERE key = 'ServiceManager'");
                   setTimeout(triggerBSOD, 1500);
                }}
                className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-2 rounded text-xs hover:bg-red-900/60 transition-all flex items-center gap-2 justify-center"
              >
                <AlertTriangle className="w-3 h-3" />
                Kill Registry (BSOD)
              </button>
              
              <button 
                onClick={() => {
                   alert("Registry optimized! System speed increased by 0.0001%");
                }}
                className="bg-blue-900/40 border border-blue-500/50 text-blue-200 px-4 py-2 rounded text-xs hover:bg-blue-900/60 transition-all flex items-center gap-2 justify-center"
              >
                Optimize Registry
              </button>

              <button 
                onClick={() => {
                   window.dispatchEvent(new CustomEvent('system:recovery'));
                }}
                className="bg-amber-900/40 border border-amber-500/50 text-amber-200 px-4 py-2 rounded text-xs hover:bg-amber-900/60 transition-all flex items-center gap-2 justify-center"
              >
                Enter Recovery Mode
              </button>

              <button 
                onClick={() => {
                   db.query("INSERT INTO files (name, type, parentId, size) VALUES ('Hacked.txt', 'text', 'Documents', '1337 KB')");
                   alert("File injected!");
                }}
                className="bg-green-900/40 border border-green-500/50 text-green-200 px-4 py-2 rounded text-xs hover:bg-green-900/60 transition-all flex items-center gap-2 justify-center"
              >
                Inject Fake File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryEditor;
