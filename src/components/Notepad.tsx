import React, { useState } from 'react';
import { db } from '../lib/db';
import { Save } from 'lucide-react';

const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [fileName] = useState('Untitled.txt');
  const [isSaved, setIsSaved] = useState(true);

  const handleSave = async () => {
    await db.query(`INSERT INTO files (name, content, type, parentId, size) VALUES ('${fileName}', '${content.replace(/'/g, "''")}', 'text', 'Documents', '${(content.length / 1024).toFixed(1)} KB')`);
    setIsSaved(true);
    alert("File saved to SQL Database!");
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex items-center justify-between px-3 py-1 text-xs border-b bg-[#f3f3f3]">
        <div className="flex gap-4">
          <span className="cursor-default hover:bg-gray-200 px-2 py-1 rounded transition-colors">File</span>
          <span className="cursor-default hover:bg-gray-200 px-2 py-1 rounded transition-colors">Edit</span>
          <span className="cursor-default hover:bg-gray-200 px-2 py-1 rounded transition-colors">View</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${isSaved ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 p-4 outline-none resize-none font-mono text-sm leading-relaxed"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsSaved(false);
        }}
        placeholder="Start typing..."
        spellCheck={false}
      />
      <div className="h-6 border-t bg-[#f3f3f3] flex items-center justify-between px-4 text-[10px] text-gray-500">
        <span>Ln 1, Col 1</span>
        <div className="flex gap-4">
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default Notepad;
