import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Loader2 } from 'lucide-react';

interface InstallerProps {
  onComplete: () => void;
}

const Installer: React.FC<InstallerProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Copying Windows files...');
  const [productKey, setProductKey] = useState('');

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 1000);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 5) + 1;
          if (next > 30) setStatus('Getting files ready for installation...');
          if (next > 70) setStatus('Installing features...');
          if (next > 85) setStatus('Installing updates...');
          if (next > 95) setStatus('Finishing up...');
          return next;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="fixed inset-0 bg-[#3a007b] flex items-center justify-center font-sans z-[11000] overflow-hidden">
      <div className="w-[600px] bg-[#f0f0f0] shadow-2xl rounded-sm overflow-hidden flex flex-col min-h-[400px]">
        {/* Header */}
        <div className="bg-white px-4 py-2 border-b flex items-center justify-between">
          <span className="text-sm font-medium">Windows Setup</span>
          <div className="flex gap-4">
             <button className="text-gray-400">_</button>
             <button className="text-gray-400">X</button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Globe className="w-12 h-12 text-blue-600" />
                   <div>
                     <h1 className="text-xl">Windows 11 SQL Enterprise</h1>
                     <p className="text-sm text-gray-600">Choose your language and region.</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Language to install:</label>
                    <select className="w-full border p-1 text-sm bg-white">
                      <option>English (United States)</option>
                      <option>English (United Kingdom)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Time and currency format:</label>
                    <select className="w-full border p-1 text-sm bg-white">
                      <option>English (United States)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Keyboard or input method:</label>
                    <select className="w-full border p-1 text-sm bg-white">
                      <option>US</option>
                    </select>
                  </div>
                </div>

                <div className="mt-auto flex justify-end">
                  <button onClick={nextStep} className="bg-[#ccc] border border-gray-400 px-8 py-1 text-sm hover:bg-[#bbb]">Next</button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center h-full gap-8"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" className="w-32 h-32" alt="Windows" />
                <button onClick={nextStep} className="bg-blue-700 text-white px-12 py-3 rounded-sm hover:bg-blue-800 shadow-md">
                  Install now
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                   <Shield className="w-10 h-10 text-blue-600" />
                   <h1 className="text-xl font-light">Activate Windows</h1>
                </div>
                <p className="text-sm text-gray-700 mb-4">If this is the first time you're installing Windows on this PC, enter your Windows product key. Otherwise, select "I don't have a product key".</p>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={productKey}
                      onChange={(e) => setProductKey(e.target.value.toUpperCase())}
                      placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                      className="flex-1 border border-gray-400 p-2 text-sm tracking-widest font-mono focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-auto flex justify-between">
                  <button onClick={() => setStep(3)} className="text-blue-600 text-sm hover:underline">I don't have a product key</button>
                  <button onClick={nextStep} className="bg-[#ccc] border border-gray-400 px-8 py-1 text-sm hover:bg-[#bbb]">Next</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h1 className="text-xl mb-2">Where do you want to install Windows?</h1>
                <p className="text-xs text-gray-500 mb-4">The following partitions were found on the SQL virtual disk.</p>
                
                <div className="border border-gray-400 bg-white flex-1 overflow-auto mb-4">
                   <table className="w-full text-xs text-left border-collapse">
                     <thead>
                       <tr className="bg-gray-100 border-b border-gray-400">
                         <th className="px-2 py-1 font-normal border-r border-gray-400">Name</th>
                         <th className="px-2 py-1 font-normal border-r border-gray-400">Total size</th>
                         <th className="px-2 py-1 font-normal border-r border-gray-400">Free space</th>
                         <th className="px-2 py-1 font-normal">Type</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="bg-blue-100">
                         <td className="px-2 py-1 border-r border-gray-400">Drive 0 Unallocated Space</td>
                         <td className="px-2 py-1 border-r border-gray-400">512.0 GB</td>
                         <td className="px-2 py-1 border-r border-gray-400">512.0 GB</td>
                         <td className="px-2 py-1">Primary</td>
                       </tr>
                     </tbody>
                   </table>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                   <button className="flex flex-col items-center justify-center p-2 border border-gray-300 hover:bg-gray-200 text-[10px] text-gray-600">
                     <span className="mb-1 text-lg">✳️</span> New
                   </button>
                   <button className="flex flex-col items-center justify-center p-2 border border-gray-300 hover:bg-gray-200 text-[10px] text-gray-600">
                     <span className="mb-1 text-lg">🗑️</span> Delete
                   </button>
                   <button className="flex flex-col items-center justify-center p-2 border border-gray-300 hover:bg-gray-200 text-[10px] text-gray-600">
                     <span className="mb-1 text-lg">🧹</span> Format
                   </button>
                   <button className="flex flex-col items-center justify-center p-2 border border-gray-300 hover:bg-gray-200 text-[10px] text-gray-600">
                     <span className="mb-1 text-lg">📥</span> Load driver
                   </button>
                </div>

                <div className="mt-auto flex justify-end">
                  <button onClick={() => setStep(4)} className="bg-[#ccc] border border-gray-400 px-8 py-1 text-sm hover:bg-[#bbb]">Next</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h1 className="text-xl mb-4">Installing Windows</h1>
                <p className="text-sm text-gray-600 mb-8">Your PC will restart several times. This might take a while.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                        {progress > 5 && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                      </div>
                      <span>{status}</span>
                    </div>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center"
              >
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <h1 className="text-2xl font-light">Restarting...</h1>
                <p className="text-sm text-gray-500">Your system is being configured for first use.</p>
                <button onClick={onComplete} className="mt-4 bg-blue-600 text-white px-6 py-2 text-sm rounded shadow">Restart now</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-gray-100 border-t flex justify-end gap-2">
           <div className="text-[10px] text-gray-400 self-center mr-auto">SQL Enterprise Edition Setup v2.0</div>
        </div>
      </div>
    </div>
  );
};

export default Installer;
