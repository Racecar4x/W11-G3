import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

const ResetApp: React.FC = () => {
  const [stage, setStage] = useState<'prompt' | 'resetting' | 'complete'>('prompt');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage === 'resetting') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStage('complete');
            setTimeout(() => {
              localStorage.removeItem('win11_sql_db');
              window.location.reload();
            }, 1500);
            return 100;
          }
          return p + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] items-center justify-center p-8 select-none">
      {stage === 'prompt' && (
        <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Reset this PC</h1>
            <p className="text-sm text-gray-500 mt-2">
              Choosing to reset will delete all files, users, and database entries. This action cannot be undone.
            </p>
          </div>
          <div className="flex flex-col w-full gap-2">
            <button 
              onClick={() => setStage('resetting')}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Remove everything
            </button>
            <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm">
              Keep my files (Not available)
            </button>
          </div>
        </div>
      )}

      {stage === 'resetting' && (
        <div className="flex flex-col items-center gap-12">
          <div className="relative">
            {/* The "Circle going backwards" animation as requested */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 rounded-full border-2 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" className="w-12 h-12" alt="Win 11" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-800">Resetting this PC</h2>
            <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
            <p className="text-xs text-gray-400 mt-1 italic">Deleting SQL tables and binary blobs...</p>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
               <RefreshCcw className="w-10 h-10" />
             </motion.div>
          </div>
          <h2 className="text-xl font-medium">Reset Complete</h2>
          <p className="text-sm text-gray-500">The system will now restart into the installer.</p>
        </div>
      )}
    </div>
  );
};

export default ResetApp;
