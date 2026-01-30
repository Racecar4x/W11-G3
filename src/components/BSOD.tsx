import React, { useEffect, useState } from 'react';

interface BSODProps {
  errorCode?: string;
  errorMessage?: string;
  onRestart?: () => void;
}

const BSOD: React.FC<BSODProps> = ({ 
  errorCode = "CRITICAL_PROCESS_DIED", 
  errorMessage = "Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.",
  onRestart
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onRestart?.(), 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [onRestart]);

  return (
    <div className="fixed inset-0 bg-[#0078d7] text-white flex flex-col justify-center px-16 md:px-32 lg:px-48 z-[10000] font-sans overflow-hidden">
      <div className="text-8xl mb-8">:(</div>
      <h1 className="text-3xl mb-8 leading-relaxed">
        {errorMessage}
      </h1>
      
      <div className="text-xl mb-12">
        {percentage}% complete
      </div>

      <div className="flex gap-12 items-start">
        <div className="bg-white p-2">
           <div className="w-24 h-24 bg-black flex items-center justify-center">
             <div className="text-white text-xs text-center p-1">QR CODE MOCK</div>
           </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
          <p className="text-sm mt-4">If you call a support person, give them this info:</p>
          <p className="text-sm font-bold uppercase">Stop code: {errorCode}</p>
        </div>
      </div>
    </div>
  );
};

export default BSOD;
