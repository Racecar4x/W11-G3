import React, { useState, useRef, useEffect } from 'react';
import { db } from '../lib/db';

const CommandPrompt: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 10.0.22621.1105]', '(c) Microsoft Corporation. All rights reserved.']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, `C:\\Users\\User>${cmd}`]);
    
    if (cmd.toLowerCase() === 'cls') {
      setHistory([]);
    } else if (cmd.toLowerCase() === 'dir') {
      const files = await db.getFiles();
      setHistory(prev => [...prev, ...files.map(f => `${f.created_at}    ${f.size.padStart(10)} ${f.name}`)]);
    } else if (cmd.toLowerCase().startsWith('echo ')) {
      setHistory(prev => [...prev, cmd.substring(5)]);
    } else if (cmd.toLowerCase() === 'help') {
      setHistory(prev => [...prev, 'Available commands: cls, dir, echo, help, ver, sql [query], recovery, bsod']);
    } else if (cmd.toLowerCase() === 'recovery') {
      window.dispatchEvent(new CustomEvent('system:recovery'));
    } else if (cmd.toLowerCase() === 'bsod') {
      window.dispatchEvent(new CustomEvent('system:bsod', { detail: { code: 'MANUAL_CRASH', message: 'User initiated system crash via command prompt.' } }));
    } else if (cmd.toLowerCase() === 'ver') {
      setHistory(prev => [...prev, 'Microsoft Windows [Version 10.0.22621.1105]']);
    } else if (cmd.toLowerCase().startsWith('sql ')) {
      try {
        const query = cmd.substring(4);
        const results = await db.query(query);
        setHistory(prev => [...prev, JSON.stringify(results, null, 2)]);
      } catch (err: any) {
        setHistory(prev => [...prev, `Error: ${err.message}`]);
      }
    } else {
      setHistory(prev => [...prev, `'${cmd.split(' ')[0]}' is not recognized as an internal or external command, operable program or batch file.`]);
    }

    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div 
      className="flex flex-col h-full bg-black text-gray-200 font-mono text-sm p-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-700"
      onClick={() => document.getElementById('cmd-input')?.focus()}
    >
      <div className="flex flex-col gap-1">
        {history.map((line, i) => (
          <pre key={i} className="whitespace-pre-wrap break-all">{line}</pre>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2 mt-1">
        <span className="shrink-0 text-gray-200">C:\Users\User&gt;</span>
        <input
          id="cmd-input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent outline-none border-none flex-1 text-gray-200"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};

export default CommandPrompt;
