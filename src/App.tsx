import React, { useState, useCallback, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import QuickSettings from './components/QuickSettings';
import Window from './components/Window';
import FileExplorer from './components/FileExplorer';
import Notepad from './components/Notepad';
import Calculator from './components/Calculator';
import Settings from './components/Settings';
import Edge from './components/Edge';
import SQLTerminal from './components/SQLTerminal';
import CommandPrompt from './components/CommandPrompt';
import RegistryEditor from './components/RegistryEditor';
import BSOD from './components/BSOD';
import RecoveryMode from './components/RecoveryMode';
import Installer from './components/Installer';
import OOBE from './components/OOBE';
import ResetApp from './components/ResetApp';
import MicrosoftStore from './components/MicrosoftStore';
import { db } from './lib/db';

type AppId = 'explorer' | 'notepad' | 'calculator' | 'edge' | 'recycle' | 'settings' | 'word' | 'excel' | 'powerpoint' | 'mail' | 'calendar' | 'store' | 'photos' | 'sql' | 'cmd' | 'registry' | 'reset' | 'build';

interface WindowState {
  id: AppId;
  title: string;
  icon: string | React.ReactNode;
  content: React.ReactNode;
  isMaximized: boolean;
  isMinimized: boolean;
}

import {
  Folder,
  FileText,
  Calculator as CalcIcon,
  Globe,
  Settings as SettingsIcon,
  Database,
  Terminal as CmdIcon,
  ShieldCheck,
  RefreshCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';

import PCBuilderApp from './components/PCBuilderApp';

const APP_METADATA: Record<string, { title: string; icon: string | React.ReactNode; content: React.ReactNode }> = {
  build: {
    title: 'PC Builder',
    icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />,
    content: <PCBuilderApp />,
  },
  explorer: {
    title: 'File Explorer',
    icon: <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500" />,
    content: <FileExplorer />,
  },
  notepad: {
    title: 'Notepad',
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    content: <Notepad />,
  },
  calculator: {
    title: 'Calculator',
    icon: <CalcIcon className="w-5 h-5 text-blue-600" />,
    content: <Calculator />,
  },
  edge: {
    title: 'Microsoft Edge',
    icon: <Globe className="w-5 h-5 text-sky-500" />,
    content: <Edge />,
  },
  settings: {
    title: 'Settings',
    icon: <SettingsIcon className="w-5 h-5 text-gray-600" />,
    content: <Settings />,
  },
  sql: {
    title: 'SQL Terminal (Real DB)',
    icon: <Database className="w-5 h-5 text-blue-400" />,
    content: <SQLTerminal />,
  },
  cmd: {
    title: 'Command Prompt',
    icon: <CmdIcon className="w-5 h-5 text-gray-800" />,
    content: <CommandPrompt />,
  },
  registry: {
    title: 'Registry Editor',
    icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
    content: <RegistryEditor />,
  },
  reset: {
    title: 'Reset this PC',
    icon: <RefreshCcw className="w-5 h-5 text-red-500" />,
    content: <ResetApp />,
  },
  store: {
    title: 'Microsoft Store',
    icon: <ShoppingBag className="w-5 h-5 text-blue-500 fill-blue-500/20" />,
    content: <MicrosoftStore />,
  },
};

import BootScreen from './components/BootScreen';
import PCBuilder from './components/PCBuilder';
import BIOS from './components/BIOS';
import BootCD from './components/BootCD';

type SystemStage = 'pc-builder' | 'bios' | 'boot-prompt' | 'installer' | 'oobe' | 'desktop';

export function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [stage, setStage] = useState<SystemStage>('pc-builder');
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [bsod, setBsod] = useState<{ active: boolean; code?: string; message?: string }>({ active: false });
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await db.init();

        // Check hardware
        const hw = await db.query("SELECT * FROM hardware");
        const hasHardware = hw && hw.length > 0;

        if (!hasHardware) {
          setStage('pc-builder');
          return;
        }

        const status = await db.query("SELECT value FROM system_state WHERE key = 'installation_status'");
        if (status && status.length > 0) {
          if (status[0].value === 'installed') {
            setStage('desktop');
          } else if (status[0].value === 'installing') {
            setStage('oobe');
          } else {
            setStage('boot-prompt');
          }
        } else {
          setStage('boot-prompt');
        }
      } catch (e: any) {
        console.error("DB Init failed", e);
        setStage('pc-builder');
      }
    };
    init();

    const handleBsodEvent = (e: any) => {
      setBsod({ active: true, code: e.detail.code, message: e.detail.message });
    };

    const handleRecoveryEvent = () => {
      setRecovery(true);
      setIsStartOpen(false);
      setOpenWindows([]);
    };

    window.addEventListener('system:bsod', handleBsodEvent);
    window.addEventListener('system:recovery', handleRecoveryEvent);
    return () => {
      window.removeEventListener('system:bsod', handleBsodEvent);
      window.removeEventListener('system:recovery', handleRecoveryEvent);
    };
  }, []);

  const triggerRestart = () => {
    setBsod({ active: false });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const fullFactoryReset = () => {
    localStorage.removeItem('win11_sql_db');
    window.location.reload();
  };

  const openApp = useCallback((appId: string) => {
    const id = appId as AppId;
    setIsStartOpen(false);

    const existingWindow = openWindows.find(w => w.id === id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
      }
      setFocusedWindowId(id);
      return;
    }

    const metadata = APP_METADATA[id] || {
      title: id.charAt(0).toUpperCase() + id.slice(1),
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg',
      content: <div className="p-8 text-center text-gray-500">App content for {id}</div>
    };

    setOpenWindows(prev => [...prev, {
      id,
      title: metadata.title,
      icon: metadata.icon,
      content: metadata.content,
      isMaximized: false,
      isMinimized: false
    }]);
    setFocusedWindowId(id);
  }, [openWindows]);

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindowId === id) {
      const remaining = openWindows.filter(w => w.id !== id);
      setFocusedWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const focusWindow = (id: string) => {
    setFocusedWindowId(id);
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setFocusedWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id === id) {
        const nextMaximized = !w.isMaximized;
        if (nextMaximized) {
          try {
            document.documentElement.requestFullscreen().catch(() => { });
          } catch (e: any) { }
        } else if (document.fullscreenElement) {
          try {
            document.exitFullscreen().catch(() => { });
          } catch (e: any) { }
        }
        return { ...w, isMaximized: nextMaximized };
      }
      return w;
    }));
  };

  const toggleStart = () => {
    setIsStartOpen(!isStartOpen);
  };

  const handleTaskbarAppClick = (appId: string) => {
    const win = openWindows.find(w => w.id === appId);
    if (win) {
      if (win.isMinimized || focusedWindowId !== appId) {
        focusWindow(appId);
      } else {
        minimizeWindow(appId);
      }
    } else {
      openApp(appId);
    }
  };

  if (bsod.active) {
    return <BSOD errorCode={bsod.code} errorMessage={bsod.message} onRestart={triggerRestart} />;
  }

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  if (recovery) {
    return <RecoveryMode onExit={() => setRecovery(false)} onFactoryReset={fullFactoryReset} />;
  }

  // --- STAGE ROUTING ---

  if (stage === 'pc-builder') {
    return <PCBuilder onComplete={() => setStage('boot-prompt')} />;
  }

  if (stage === 'bios') {
    return <BIOS onExit={() => setStage('boot-prompt')} />;
  }

  if (stage === 'boot-prompt') {
    return (
      <BootCD
        onBootCD={() => setStage('installer')}
        onBootDisk={async () => {
          const status = await db.query("SELECT value FROM system_state WHERE key = 'installation_status'");
          if (status?.[0]?.value === 'installed') setStage('desktop');
          else if (status?.[0]?.value === 'installing') setStage('oobe');
          else setStage('installer');
        }}
        onEnterBIOS={() => setStage('bios')}
      />
    );
  }

  if (stage === 'installer') {
    return <Installer onComplete={async () => {
      await db.query("UPDATE system_state SET value = 'installing' WHERE key = 'installation_status'");
      setStage('oobe');
    }} />;
  }

  if (stage === 'oobe') {
    return <OOBE onComplete={() => setStage('desktop')} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden font-sans text-gray-900 bg-black">
      <Desktop onIconDoubleClick={openApp}>
        {openWindows.map((win, index) => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={!win.isMinimized}
            isFocused={focusedWindowId === win.id}
            isMaximized={win.isMaximized}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            zIndex={focusedWindowId === win.id ? 100 : 10 + index}
          >
            {win.content}
          </Window>
        ))}
      </Desktop>

      <StartMenu
        isOpen={isStartOpen}
        onAppClick={openApp}
      />

      <QuickSettings
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
      />

      <Taskbar
        onStartClick={toggleStart}
        onTrayClick={() => setIsTrayOpen(!isTrayOpen)}
        openApps={openWindows.map(w => w.id)}
        activeApp={focusedWindowId}
        onAppClick={handleTaskbarAppClick}
      />

      {isStartOpen && (
        <div
          className="fixed inset-0 z-[800]"
          onClick={() => setIsStartOpen(false)}
        />
      )}
    </div>
  );
}

