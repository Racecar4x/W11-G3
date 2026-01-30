import React, { useEffect, useState } from 'react';

interface BootCDProps {
    onBootCD: () => void;
    onBootDisk: () => void;
    onEnterBIOS: () => void;
}

const BootCD = ({ onBootCD, onBootDisk, onEnterBIOS }: BootCDProps) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setDots((prev: string) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                onEnterBIOS();
            } else {
                onBootCD();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // If no key pressed after 5 seconds, boot from disk
        const autoBoot = setTimeout(() => {
            onBootDisk();
        }, 5000);

        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(autoBoot);
        };
    }, [onBootCD, onBootDisk, onEnterBIOS]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono text-gray-200 z-[14000] cursor-none select-none">
            <div className="flex flex-col gap-4 items-start w-[600px]">
                <div className="text-lg">
                    Press any key to boot from CD or DVD{dots}
                </div>

                <div className="text-xs text-gray-600 mt-12 animate-pulse">
                    - Press [SPACE] to enter BIOS Setup Utility
                </div>

                <div className="text-xs text-gray-600">
                    - Press any other key to start Windows Setup
                </div>
            </div>

            <div className="absolute bottom-12 left-12 text-[10px] text-gray-800 uppercase tracking-widest">
                UEFI Virtual Bootloader v1.0
            </div>
        </div>
    );
};

export default BootCD;
