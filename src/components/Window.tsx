import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface WindowProps {
  id: string;
  title: string;
  icon: string | React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  isFocused: boolean;
  isMaximized: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  zIndex: number;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  children,
  isOpen,
  isFocused,
  isMaximized,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  zIndex
}) => {
  const controls = useDragControls();

  if (!isOpen) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: isMaximized ? '100vw' : '850px',
        height: isMaximized ? 'calc(100vh - 48px)' : '580px',
        top: isMaximized ? 0 : '80px',
        left: isMaximized ? 0 : '120px',
        borderRadius: isMaximized ? 0 : 12
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      style={{ zIndex }}
      onPointerDown={() => onFocus(id)}
      className={cn(
        "fixed bg-[#f3f3f3]/90 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col border border-white/30",
        isFocused ? "shadow-black/30" : "shadow-black/10"
      )}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between select-none"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center px-3 gap-2 flex-1 h-full">
          {typeof icon === 'string' ? (
            <img src={icon} alt="" className="w-4 h-4" />
          ) : (
            icon
          )}
          <span className="text-xs text-gray-700">{title}</span>
        </div>
        
        <div className="flex h-full">
          <button 
            onClick={() => onMinimize(id)}
            className="w-11 h-full flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onMaximize(id)}
            className="w-11 h-full flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            {isMaximized ? <Square className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => onClose(id)}
            className="w-11 h-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
