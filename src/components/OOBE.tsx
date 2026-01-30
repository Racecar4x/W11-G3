import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Globe, Check } from 'lucide-react';
import { db } from '../lib/db';

interface OOBEProps {
  onComplete: () => void;
}

const OOBE: React.FC<OOBEProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState('United States');
  const [keyboard, setKeyboard] = useState('US');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Checking for updates...');

  const regions = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil'];

  const handleFinish = async () => {
    setLoading(true);
    setLoadingStatus('Creating your account...');
    await db.query(`INSERT INTO users (name, email) VALUES ('${username || 'User'}', '${(username || 'user').toLowerCase()}@windows11.local')`);

    setLoadingStatus('Cleaning up...');
    await db.query(`UPDATE system_state SET value = 'installed' WHERE key = 'installation_status'`);

    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center flex items-center justify-center font-sans z-[12000] overflow-hidden select-none"
      style={{ backgroundImage: `url('https://4kwallpapers.com/images/wallpapers/windows-11-bloom-dark-mode-stock-abstract-background-3840x2160-5645.jpg')` }}>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[1000px] h-[650px] bg-white/70 backdrop-blur-3xl rounded-3xl shadow-2xl flex overflow-hidden border border-white/40"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex w-full h-full"
            >
              <div className="w-1/2 p-16 flex flex-col items-center justify-center bg-blue-50/30">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" className="w-48 h-48 mb-8" alt="Windows" />
                <h1 className="text-xl font-medium text-gray-700 text-center">Let's get started with your region.</h1>
              </div>
              <div className="w-1/2 p-16 flex flex-col">
                <h2 className="text-2xl font-light text-gray-900 mb-8">Is this the right country or region?</h2>
                <div className="flex-1 overflow-y-auto space-y-1 pr-4 custom-scrollbar">
                  {regions.map(r => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${region === r ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-transparent border-transparent hover:bg-gray-200 text-gray-700'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-10 py-2 rounded shadow-lg hover:bg-blue-700 transition-colors">Yes</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex w-full h-full"
            >
              <div className="w-1/2 p-16 flex flex-col items-center justify-center bg-blue-50/30">
                <Globe className="w-32 h-32 text-blue-600 mb-8" />
                <h1 className="text-xl font-medium text-gray-700 text-center">Select your keyboard layout.</h1>
              </div>
              <div className="w-1/2 p-16 flex flex-col text-gray-900">
                <h2 className="text-2xl font-light mb-8">Is this the right keyboard layout or input method?</h2>
                <div className="flex-1 space-y-2">
                  {['US', 'United Kingdom', 'United Kingdom (Extended)', 'French', 'German'].map(k => (
                    <button
                      key={k}
                      onClick={() => setKeyboard(k)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${keyboard === k ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-transparent border-transparent hover:bg-gray-200'}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end gap-4 text-sm font-medium">
                  <button onClick={() => setStep(0)} className="text-gray-500 hover:text-gray-900">Back</button>
                  <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-10 py-2 rounded shadow-lg">Yes</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex w-full h-full"
            >
              <div className="w-1/2 p-16 flex flex-col items-center justify-center bg-blue-50/30">
                <div className="w-32 h-32 text-blue-600 mb-8 flex items-center justify-center border-4 border-dashed border-blue-200 rounded-full">
                  <Globe className="w-16 h-16 animate-pulse" />
                </div>
                <h1 className="text-xl font-medium text-gray-700 text-center">Let's connect you to a network.</h1>
              </div>
              <div className="w-1/2 p-16 flex flex-col text-gray-900">
                <h2 className="text-2xl font-light mb-4">Connecting to the internet</h2>
                <p className="text-sm text-gray-500 mb-8">You'll need an internet connection to continue setting up your device. This helps us get the latest updates and features.</p>
                <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-gray-400 text-sm">No networks found</div>
                  <button className="text-blue-600 text-xs hover:underline">Retry</button>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-gray-500 hover:text-blue-600 font-semibold"
                  >
                    I don't have internet
                  </button>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 text-sm font-medium">Back</button>
                    <button disabled className="bg-gray-300 text-gray-500 px-10 py-2 rounded shadow-lg cursor-not-allowed text-sm">Next</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex w-full h-full"
            >
              <div className="w-1/2 p-16 flex flex-col items-center justify-center bg-blue-50/30">
                <User className="w-32 h-32 text-blue-600 mb-8" />
                <h1 className="text-xl font-medium text-gray-700 text-center">Naming your PC.</h1>
              </div>
              <div className="w-1/2 p-16 flex flex-col text-gray-900">
                <h2 className="text-2xl font-light mb-4">Who's going to use this device?</h2>
                <p className="text-sm text-gray-500 mb-8">Enter the name of the primary user for this PC.</p>
                <input
                  type="text"
                  autoFocus
                  placeholder="Name"
                  className="w-full bg-white border border-gray-300 rounded-md p-3 text-lg outline-none focus:ring-2 focus:ring-blue-600"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <div className="mt-auto flex justify-end gap-4 text-sm font-medium">
                  <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-900">Back</button>
                  <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-10 py-2 rounded shadow-lg">Next</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex w-full h-full"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center w-full gap-8 bg-blue-600 transition-colors">
                  <div className="relative w-16 h-16">
                    {[...Array(6)].map((_: any, i: number) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.8, 1.2, 0.8],
                          top: 32 + Math.sin(i * 60 * Math.PI / 180) * 24,
                          left: 32 + Math.cos(i * 60 * Math.PI / 180) * 24,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <h1 className="text-2xl font-light text-white italic">{loadingStatus}</h1>
                </div>
              ) : (
                <>
                  <div className="w-1/2 p-16 flex flex-col items-center justify-center bg-blue-50/30">
                    <ShieldCheck className="w-32 h-32 text-blue-600 mb-8" />
                    <h1 className="text-xl font-medium text-gray-700 text-center">Privacy settings.</h1>
                  </div>
                  <div className="w-1/2 p-16 flex flex-col text-gray-900 overflow-y-auto">
                    <h2 className="text-2xl font-light mb-8">Choose privacy settings for your device</h2>
                    <div className="space-y-4 pr-2">
                      {[
                        { title: 'Location', desc: 'Let Windows and apps use your location.' },
                        { title: 'Find my device', desc: 'Track your device if you lose it.' },
                        { title: 'Diagnostic data', desc: 'Help Microsoft fix Windows problems.' },
                        { title: 'Inking & typing', desc: 'Improve language recognition.' }
                      ].map(item => (
                        <div key={item.title} className="p-3 border rounded-lg flex items-center gap-4 bg-white/50">
                          <div className="flex-1">
                            <div className="text-sm font-semibold">{item.title}</div>
                            <div className="text-[10px] text-gray-500">{item.desc}</div>
                          </div>
                          <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button onClick={handleFinish} className="bg-blue-600 text-white px-10 py-2 rounded shadow-lg">Accept</button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Accessibility Info */}
      <div className="absolute bottom-12 flex gap-8 text-white/50 text-[10px]">
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <Globe className="w-3 h-3" /> Volume
        </button>
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <Check className="w-3 h-3" /> Accessibility
        </button>
      </div>
    </div>
  );
};

export default OOBE;
