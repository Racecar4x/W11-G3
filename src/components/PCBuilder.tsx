import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Box, HardDrive, Cpu as Gpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '../lib/db';

interface PCBuilderProps {
    onComplete: () => void;
}

const PCBuilder: React.FC<PCBuilderProps> = ({ onComplete }) => {
    const [specs, setSpecs] = useState({
        cpu: 'Intel Core i9-13900K',
        ram: '32GB DDR5',
        storage: '2TB NVMe SSD',
    });

    const [step, setStep] = useState(0);

    const CPU_OPTIONS = ['Intel Core i9-13900K', 'AMD Ryzen 9 7950X', 'Intel Core i7-13700K'];
    const RAM_OPTIONS = ['16GB DDR5', '32GB DDR5', '64GB DDR5', '128GB DDR5'];
    const STORAGE_OPTIONS = ['512GB NVMe', '1TB NVMe', '2TB NVMe', '4TB NVMe'];

    const handleFinish = async () => {
        await db.query(`UPDATE hardware SET value = '${specs.cpu}' WHERE key = 'cpu'`);
        await db.query(`UPDATE hardware SET value = '${specs.ram}' WHERE key = 'ram'`);
        await db.query(`UPDATE hardware SET value = '${specs.storage}' WHERE key = 'storage'`);
        onComplete();
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center font-sans z-[15000] overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-[900px] h-[600px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden relative"
            >
                {/* Sidebar */}
                <div className="w-64 bg-white/5 border-r border-white/5 p-8 flex flex-col gap-8">
                    <div className="flex items-center gap-3 text-blue-400">
                        <Box className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight">RigBuilder</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { icon: <Cpu />, label: 'Processor', active: step === 0 },
                            { icon: <Gpu />, label: 'Memory', active: step === 1 },
                            { icon: <HardDrive />, label: 'Storage', active: step === 2 },
                            { icon: <CheckCircle2 />, label: 'Summary', active: step === 3 },
                        ].map((item: any, i: number) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500'}`}>
                                {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                        <div className="text-[10px] text-blue-400 uppercase font-bold mb-1">Estimated Cost</div>
                        <div className="text-2xl font-bold text-white">$0.00</div>
                        <div className="text-[10px] text-gray-500 italic">Simulation Mode Active</div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-12 flex flex-col">
                    {step === 0 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                            <h2 className="text-3xl font-bold text-white mb-2">Choose your Processor</h2>
                            <p className="text-gray-400 mb-8">Select the heart of your virtual machine.</p>
                            <div className="grid grid-cols-1 gap-4">
                                {CPU_OPTIONS.map(cpu => (
                                    <button
                                        key={cpu}
                                        onClick={() => { setSpecs({ ...specs, cpu }); setStep(1); }}
                                        className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${specs.cpu === cpu ? 'bg-blue-600/10 border-blue-600 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div>
                                            <div className="text-white font-semibold">{cpu}</div>
                                            <div className="text-xs text-gray-500 mt-1">High-performance silicon optimized for virtualization.</div>
                                        </div>
                                        <ArrowRight className={`w-5 h-5 transition-transform ${specs.cpu === cpu ? 'text-blue-400 translate-x-0' : 'text-gray-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-3xl font-bold text-white mb-2">Memory Allocation</h2>
                            <p className="text-gray-400 mb-8">How much RAM does your system need?</p>
                            <div className="grid grid-cols-2 gap-4">
                                {RAM_OPTIONS.map(ram => (
                                    <button
                                        key={ram}
                                        onClick={() => { setSpecs({ ...specs, ram }); setStep(2); }}
                                        className={`p-6 rounded-2xl border transition-all text-center ${specs.ram === ram ? 'bg-blue-600/10 border-blue-600' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="text-2xl font-bold text-white">{ram}</div>
                                        <div className="text-xs text-gray-500 mt-1">DDR5 High Speed</div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setStep(0)} className="mt-8 text-sm text-gray-500 hover:text-white">Back</button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-3xl font-bold text-white mb-2">Storage Capacity</h2>
                            <p className="text-gray-400 mb-8">Define your primary boot drive size.</p>
                            <div className="grid grid-cols-2 gap-4">
                                {STORAGE_OPTIONS.map(storage => (
                                    <button
                                        key={storage}
                                        onClick={() => { setSpecs({ ...specs, storage }); setStep(3); }}
                                        className={`p-6 rounded-2xl border transition-all text-center ${specs.storage === storage ? 'bg-blue-600/10 border-blue-600' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="text-2xl font-bold text-white">{storage}</div>
                                        <div className="text-xs text-gray-500 mt-1">PCIe Gen 5.0 SSD</div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setStep(1)} className="mt-8 text-sm text-gray-500 hover:text-white">Back</button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                            <h2 className="text-3xl font-bold text-white mb-2">System Summary</h2>
                            <p className="text-gray-400 mb-8">Your virtual machine is ready for assembly.</p>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-500">Processor</span>
                                    <span className="text-white font-medium">{specs.cpu}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-500">Memory</span>
                                    <span className="text-white font-medium">{specs.ram}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-500">Storage</span>
                                    <span className="text-white font-medium">{specs.storage}</span>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <button
                                    onClick={handleFinish}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    Assemble and Boot PC
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button onClick={() => setStep(2)} className="w-full text-sm text-gray-500 hover:text-white text-center">Reconfigure</button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
                Virtual Hardware Revision 2.0 // No Cost Simulated Environment
            </div>
        </div>
    );
};

export default PCBuilder;
