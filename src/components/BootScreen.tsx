import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Black screen (0.5s)
    // Stage 1: Logo appearing (1s)
    // Stage 2: Loading spinner (2s)
    // Stage 3: Fade out (0.5s)
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 3500),
      setTimeout(() => onComplete(), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center select-none overflow-hidden">
      <AnimatePresence>
        {stage >= 1 && stage < 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="grid grid-cols-2 gap-1 w-24 h-24 mb-16 brightness-200">
               <div className="bg-blue-600 rounded-tl-sm" />
               <div className="bg-blue-600 rounded-tr-sm" />
               <div className="bg-blue-600 rounded-bl-sm" />
               <div className="bg-blue-600 rounded-br-sm" />
            </div>
            
            {stage >= 2 && (
              <div className="relative w-10 h-10">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.8, 1, 0.8],
                      top: 20 + Math.sin(i * 45 * Math.PI / 180) * 20,
                      left: 20 + Math.cos(i * 45 * Math.PI / 180) * 20,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {stage === 3 && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
        />
      )}
    </div>
  );
};

export default BootScreen;
