import React, { useState, useRef, useEffect } from 'react';
import { Database, Terminal, Play, Trash2, AlertCircle } from 'lucide-react';
import { runQuery } from '../lib/sqlDB';

const SQLTerminal: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM files;');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setHistory] = useState<string[]>([]);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  const [lastAction, setLastAction] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const interpretAndRun = () => {
    const q = query.trim().toLowerCase();
    let sql = query;

    console.log("Interpreting query:", q);

    if (q.includes('create') && q.includes('user')) {
      const parts = query.split(/\s+/);
      const name = parts.length > 2 ? parts.slice(2).join(' ') : 'New User';
      sql = `INSERT INTO users (name, email) VALUES ('${name}', '${name.toLowerCase().replace(/\s+/g, '')}@windows11.local');`;
    } else if (q.includes('delete') && q.includes('user')) {
      const parts = query.split(/\s+/);
      const name = parts.length > 2 ? parts.slice(2).join(' ') : '';
      sql = `DELETE FROM users WHERE name = '${name}';`;
    } else if ((q.includes('show') || q.includes('list')) && q.includes('user')) {
      sql = `SELECT * FROM users;`;
    } else if ((q.includes('show') || q.includes('list')) && q.includes('file')) {
      sql = `SELECT * FROM files;`;
    } else if (q.includes('create') && q.includes('file')) {
      const parts = query.split(/\s+/);
      const name = parts.length > 2 ? parts.slice(2).join(' ') : 'newfile.txt';
      sql = `INSERT INTO files (name, content, type, parentId, size) VALUES ('${name}', 'New file content', 'text', 'Documents', '0 KB');`;
    } else if (q.includes('delete') && q.includes('file')) {
      const parts = query.split(/\s+/);
      const name = parts.length > 2 ? parts.slice(2).join(' ') : '';
      sql = `DELETE FROM files WHERE name = '${name}';`;
    } else if (q.includes('destroy') || q.includes('kill') || q.includes('crash')) {
      sql = `DELETE FROM registry WHERE key = 'ServiceManager';`;
      // Trigger actual BSOD for effect
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('system:bsod', {
          detail: { code: 'CRITICAL_SYSTEM_PROCESS_TERMINATED', message: 'The SQL process killed a critical system component.' }
        }));
      }, 1000);
    } else if (q.includes('recovery') || q.includes('repair')) {
      window.dispatchEvent(new CustomEvent('system:recovery'));
      return;
    } else if (q.includes('reset')) {
      sql = "DELETE FROM users; DELETE FROM files; DELETE FROM system_state;";
      setLastAction('System state cleared. Restart required.');
    }

    executeSQL(sql);
  };

  const executeSQL = (sqlOverride?: string) => {
    const finalQuery = sqlOverride || query;
    try {
      setError(null);
      setHasRun(true);
      const res = runQuery(finalQuery);

      const mutationKeywords = ['INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'REPLACE'];
      const isMutation = mutationKeywords.some(keyword => finalQuery.toUpperCase().includes(keyword));

      if (isMutation) {
        setResults([]); // Clear results on mutations to avoid confusion
        setLastAction('Command executed successfully.');
        setTimeout(() => setLastAction(null), 3000);
      } else {
        setResults(res);
      }

      setHistory((prev: string[]) => [finalQuery, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || 'An error occurred during query execution.');
      setResults([]);
    }
  };

  const enterRecovery = () => {
    window.dispatchEvent(new CustomEvent('system:recovery'));
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
    setHasRun(false);
  };

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results, error]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-gray-400">SQL Server (SQLite3 in-browser)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => interpretAndRun()}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Interpret & Run</span>
          </button>
          <button
            onClick={enterRecovery}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs transition-colors"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Mode: Recovery</span>
          </button>
          <button
            onClick={clearResults}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Clear Results"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="h-1/3 flex border-b border-[#3d3d3d]">
        <div className="w-10 bg-[#252526] flex flex-col items-center pt-2 text-gray-600 select-none">
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>
        <textarea
          value={query}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
          className="flex-1 bg-transparent p-2 outline-none resize-none text-blue-300"
          placeholder="Enter SQL here..."
          spellCheck={false}
        />
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
        {lastAction && (
          <div className="flex items-center gap-2 p-2 bg-green-900/20 border border-green-900/50 rounded text-green-400 mb-4 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {lastAction}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold">Execution Error</span>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#3d3d3d]">
              <thead>
                <tr className="bg-[#2d2d2d]">
                  {Object.keys(results[0]).map((col) => (
                    <th key={col} className="border border-[#3d3d3d] px-3 py-1.5 text-left text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    {Object.values(row).map((val: any, i) => (
                      <td key={i} className="border border-[#3d3d3d] px-3 py-1.5 text-xs">
                        {val === null ? <span className="text-gray-600 italic">NULL</span> : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[10px] text-gray-500">{results.length} rows returned</p>
          </div>
        ) : hasRun ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            {!error && <div className="flex flex-col items-center gap-2">
              <span className="text-green-500 font-bold">✓ Success</span>
              <span className="text-xs">Query executed, 0 rows returned.</span>
            </div>}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <Terminal className="w-12 h-12 mb-2" />
            <span>Ready for query execution</span>
          </div>
        )}
        <div ref={resultsEndRef} />
      </div>

      {/* Footer / Info */}
      <div className="bg-[#2d2d2d] px-4 py-1 flex items-center justify-between text-[10px] text-gray-500 border-t border-[#3d3d3d]">
        <div className="flex gap-4">
          <span>Connected: localhost\SQLITE</span>
          <span>Master Database</span>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>Rows: {results.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SQLTerminal;
