import React from 'react';
import { Settings, RefreshCw, Terminal, ArrowLeft, ShieldAlert } from 'lucide-react';

interface RecoveryModeProps {
  onExit: () => void;
  onFactoryReset: () => void;
}

const RecoveryMode: React.FC<RecoveryModeProps> = ({ onExit, onFactoryReset }) => {
  return (
    <div className="fixed inset-0 bg-[#004275] text-white flex flex-col items-center justify-center font-sans z-[10001] p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-light mb-8">Choose an option</h1>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={onExit}
            className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/10 rounded"
          >
            <ArrowLeft className="w-8 h-8" />
            <div>
              <div className="text-xl font-medium">Continue</div>
              <div className="text-sm opacity-70 text-gray-300">Exit and continue to Windows 11 SQL Edition</div>
            </div>
          </button>

          <button 
            className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/10 rounded"
          >
            <Settings className="w-8 h-8" />
            <div>
              <div className="text-xl font-medium">Use a device</div>
              <div className="text-sm opacity-70 text-gray-300">Use a USB drive, network connection, or Windows recovery DVD</div>
            </div>
          </button>

          <div className="p-6 bg-white/5 border border-white/10 rounded">
            <div className="flex items-center gap-6 mb-6">
              <RefreshCw className="w-8 h-8" />
              <div className="text-xl font-medium">Troubleshoot</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
              <button 
                onClick={onFactoryReset}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 transition-colors rounded border border-white/5"
              >
                <ShieldAlert className="w-6 h-6 text-red-400" />
                <div className="text-sm">Factory Reset Database</div>
              </button>
              
              <button className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 transition-colors rounded border border-white/5">
                <Terminal className="w-6 h-6" />
                <div className="text-sm">Command Prompt</div>
              </button>
              
              <button className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 transition-colors rounded border border-white/5">
                <Settings className="w-6 h-6" />
                <div className="text-sm">UEFI Firmware Settings</div>
              </button>
              
              <button className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 transition-colors rounded border border-white/5 text-left">
                <RefreshCw className="w-6 h-6" />
                <div className="text-sm">System Restore</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryMode;
