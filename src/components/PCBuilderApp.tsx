import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Cpu, HardDrive, Zap, Save, RefreshCw } from 'lucide-react';

const PCBuilderApp: React.FC = () => {
    const [specs, setSpecs] = useState({
        cpu: '',
        ram: '',
        storage: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecs = async () => {
            const data = await db.query('SELECT * FROM hardware');
            const newSpecs = { cpu: '', ram: '', storage: '' };
            data.forEach((item: any) => {
                if (item.key === 'cpu') newSpecs.cpu = item.value;
                if (item.key === 'ram') newSpecs.ram = item.value;
                if (item.key === 'storage') newSpecs.storage = item.value;
            });
            setSpecs(newSpecs);
            setLoading(false);
        };
        fetchSpecs();
    }, []);

    const handleSave = async () => {
        await db.query(`UPDATE hardware SET value = '${specs.cpu}' WHERE key = 'cpu'`);
        await db.query(`UPDATE hardware SET value = '${specs.ram}' WHERE key = 'ram'`);
        await db.query(`UPDATE hardware SET value = '${specs.storage}' WHERE key = 'storage'`);
        alert("Hardware profile updated! Changes will take effect after standard system restart.");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading hardware access layer...</div>;

    return (
        <div className="flex flex-col h-full bg-[#f3f3f3] select-none">
            <div className="p-8 flex-1 overflow-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">Rig Tuning Station</h1>
                        <p className="text-sm text-gray-500">Modify your virtual hardware parameters in real-time.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 text-blue-600">
                            <Cpu className="w-5 h-5" />
                            <span className="font-semibold">Processor</span>
                        </div>
                        <select
                            value={specs.cpu}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpecs({ ...specs, cpu: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-sm"
                        >
                            <option>Intel Core i9-13900K</option>
                            <option>AMD Ryzen 9 7950X</option>
                            <option>Intel Core i7-13700K</option>
                        </select>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 text-purple-600">
                            <Zap className="w-5 h-5" />
                            <span className="font-semibold">Memory</span>
                        </div>
                        <select
                            value={specs.ram}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpecs({ ...specs, ram: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/20 text-sm"
                        >
                            <option>16GB DDR5</option>
                            <option>32GB DDR5</option>
                            <option>64GB DDR5</option>
                            <option>128GB DDR5</option>
                        </select>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 text-orange-600">
                            <HardDrive className="w-5 h-5" />
                            <span className="font-semibold">Storage</span>
                        </div>
                        <select
                            value={specs.storage}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpecs({ ...specs, storage: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-600/20 text-sm"
                        >
                            <option>512GB NVMe</option>
                            <option>1TB NVMe</option>
                            <option>2TB NVMe</option>
                            <option>4TB NVMe</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-400 italic">
                    Note: Higher specs require more virtual power.
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reboot to BIOS
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-600/30"
                    >
                        <Save className="w-4 h-4" />
                        Apply Hardware
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PCBuilderApp;
