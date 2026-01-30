import React from 'react';
import { Wifi, Volume2, Battery, Bluetooth, Moon, Plane, Sun, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[850]" onClick={onClose} />
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="fixed bottom-14 right-3 w-80 bg-white/85 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl z-[900] p-4 flex flex-col gap-4"
          >
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: <Wifi className="w-5 h-5" />, label: 'Wi-Fi', active: true },
                { icon: <Bluetooth className="w-5 h-5" />, label: 'Bluetooth', active: true },
                { icon: <Plane className="w-5 h-5" />, label: 'Airplane', active: false },
                { icon: <Moon className="w-5 h-5" />, label: 'Night light', active: false },
                { icon: <RotateCcw className="w-5 h-5" />, label: 'Battery saver', active: false },
                { icon: <Sun className="w-5 h-5" />, label: 'Brightness', active: false },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group cursor-default">
                  <div className={`w-full aspect-square flex items-center justify-center rounded-md transition-colors ${item.active ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-center w-full truncate">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 px-2">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4" />
                <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-3/4 bg-blue-600 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4" />
                <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="h-10 bg-black/5 -mx-4 -mb-4 mt-2 px-4 flex items-center justify-between border-t border-black/5">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                <span className="text-xs font-medium">100%</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickSettings;
