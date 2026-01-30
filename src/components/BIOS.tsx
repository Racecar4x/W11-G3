import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';

interface BIOSProps {
    onExit: () => void;
}

const BIOS = ({ onExit }: BIOSProps) => {
    const [activeTab, setActiveTab] = useState('Main');
    const [cpu, setCpu] = useState('Loading...');
    const [ram, setRam] = useState('Loading...');

    const [bootOrder] = useState(['Hard Drive', 'CD/DVD-ROM', 'Network']);
    const [selectedBootIndex, setSelectedBootIndex] = useState(0);

    useEffect(() => {
        const fetchHardware = async () => {
            const data = await db.query('SELECT * FROM hardware');
            data.forEach((item: { key: string; value: string }) => {
                if (item.key === 'cpu') setCpu(item.value);
                if (item.key === 'ram') setRam(item.value);
            });
        };
        fetchHardware();
    }, []);

    const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Exit'];

    return (
        <div className="fixed inset-0 bg-[#000080] font-mono text-[#AAAAAA] z-[16000] p-4 flex flex-col uppercase">
            {/* Header */}
            <div className="bg-[#AAAAAA] text-[#000080] px-4 py-1 font-bold flex justify-between mb-4">
                <span>Aptio Setup Utility - Copyright (C) 2026 American Megatrends, Inc.</span>
                <span>BIOS v2.20</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#AAAAAA] mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-1 ${activeTab === tab ? 'bg-[#AAAAAA] text-[#000080]' : 'hover:bg-white/10'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 border-2 border-[#AAAAAA] p-4 flex relative">
                <div className="flex-1 flex flex-col gap-2">
                    {activeTab === 'Main' && (
                        <>
                            <div className="grid grid-cols-2 gap-x-8 max-w-2xl">
                                <span>BIOS Vendor</span> <span className="text-white">American Megatrends</span>
                                <span>Core Version</span> <span className="text-white">5.19</span>
                                <span>Compliancy</span> <span className="text-white">UEFI 2.8; PI 1.7</span>
                                <div className="h-4" />
                                <span>Processor Information</span> <span className="text-white">{cpu}</span>
                                <span>System Memory</span> <span className="text-white">{ram}</span>
                                <div className="h-4" />
                                <span>System Date</span> <span className="text-white">[{new Date().toLocaleDateString()}]</span>
                                <span>System Time</span> <span className="text-white">[{new Date().toLocaleTimeString()}]</span>
                            </div>
                        </>
                    )}

                    {activeTab === 'Boot' && (
                        <div className="flex flex-col gap-2">
                            <span className="text-white mb-2 underline">Boot Option Priorities</span>
                            {bootOrder.map((item: string, i: number) => (
                                <div
                                    key={i}
                                    className={`flex gap-4 px-2 ${selectedBootIndex === i ? 'bg-[#AAAAAA] text-[#000080]' : ''}`}
                                    onMouseEnter={() => setSelectedBootIndex(i)}
                                >
                                    <span className="w-48">Boot Option #{i + 1}</span>
                                    <span className="text-white">[{item}]</span>
                                </div>
                            ))}
                            <div className="mt-4 text-[10px] lowercase italic text-gray-400">
                                Use arrow keys for navigation. (Simulation: Hover/Click)
                            </div>
                        </div>
                    )}

                    {activeTab === 'Exit' && (
                        <div className="flex flex-col gap-4 items-start pt-8">
                            <button onClick={onExit} className="hover:text-white underline">Save Changes and Exit</button>
                            <button onClick={onExit} className="hover:text-white underline">Discard Changes and Exit</button>
                            <button className="hover:text-white underline">Load Setup Defaults</button>
                        </div>
                    )}
                </div>

                {/* Right Help Box */}
                <div className="w-64 border-l border-[#AAAAAA] pl-4 flex flex-col gap-4 text-xs">
                    <div className="text-white border-b border-[#AAAAAA] pb-2">Help</div>
                    <p>Exit System Setup and save your changes to CMOS.</p>
                    <div className="mt-auto flex flex-col gap-1 text-[#AAAAAA]/60">
                        <span>→←: Select Screen</span>
                        <span>↑↓: Select Item</span>
                        <span>Enter: Select</span>
                        <span>+/-: Change Opt.</span>
                        <span>F1: General Help</span>
                        <span>F9: Optimized Defaults</span>
                        <span>F10: Save & Exit</span>
                        <span>ESC: Exit</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-center text-[10px] opacity-50">
                Virtual Machine Identity: 0x8F92-SQL-WIN11
            </div>
        </div>
    );
};

export default BIOS;
