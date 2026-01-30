import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  RotateCw, 
  Search,
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Download,
  Clock,
  Star
} from 'lucide-react';
import { db } from '../lib/db';
import { cn } from '../utils/cn';

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState('Documents');

  const loadFiles = async () => {
    const data = await db.query('SELECT * FROM files');
    setFiles(data);
  };

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const sidebarItems = [
    { icon: <Clock className="w-4 h-4 text-blue-600" />, label: 'Recent' },
    { icon: <Star className="w-4 h-4 text-yellow-500" />, label: 'Favorites' },
    { icon: <Download className="w-4 h-4 text-blue-600" />, label: 'Downloads' },
    { icon: <FileText className="w-4 h-4 text-blue-600" />, label: 'Documents' },
    { icon: <ImageIcon className="w-4 h-4 text-blue-600" />, label: 'Pictures' },
    { icon: <Music className="w-4 h-4 text-blue-600" />, label: 'Music' },
    { icon: <Video className="w-4 h-4 text-blue-600" />, label: 'Videos' },
  ];

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Toolbar */}
      <div className="h-12 border-b flex items-center px-4 gap-4 bg-[#f3f3f3]">
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ChevronRight className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ChevronUp className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><RotateCw className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 max-w-2xl bg-white border border-gray-300 rounded px-3 py-1 text-xs flex items-center gap-2 shadow-sm">
          <Folder className="w-3 h-3 text-yellow-600" />
          <span>This PC &gt; {currentPath}</span>
        </div>
        <div className="w-48 bg-white border border-gray-300 rounded px-3 py-1 text-xs flex items-center gap-2 shadow-sm">
          <Search className="w-3 h-3 text-gray-400" />
          <input type="text" placeholder={`Search ${currentPath}`} className="bg-transparent outline-none w-full" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r py-4 flex flex-col gap-1 bg-[#f3f3f3]">
          {sidebarItems.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentPath(item.label)}
              className={cn(
                "flex items-center gap-3 px-4 py-1.5 hover:bg-white/50 cursor-default text-[13px]",
                currentPath === item.label && "bg-white shadow-sm"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-white overflow-auto">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {files.filter(f => {
              if (!f.parentId) return currentPath === 'Documents'; // Default to documents
              return f.parentId.toLowerCase() === currentPath.toLowerCase();
            }).map((file) => (
              <div key={file.id} className="flex flex-col items-center gap-1 group cursor-default w-24">
                <div className="w-16 h-16 flex items-center justify-center rounded group-hover:bg-blue-50 transition-colors">
                  {file.type === 'text' ? (
                    <FileText className="w-10 h-10 text-blue-400" />
                  ) : file.type === 'image' ? (
                    <ImageIcon className="w-10 h-10 text-purple-400" />
                  ) : (
                    <Folder className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <span className="text-[11px] text-center line-clamp-2 w-full px-1">{file.name}</span>
              </div>
            ))}
            
            {/* Show empty message if no files */}
            {files.filter(f => f.parentId === currentPath.toLowerCase()).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <Folder className="w-16 h-16 mb-2 opacity-20" />
                <p className="text-sm">This folder is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
