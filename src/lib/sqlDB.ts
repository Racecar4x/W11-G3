import initSqlJs, { Database } from 'sql.js';

let dbInstance: Database | null = null;

const DB_SAVE_KEY = 'win11_sql_db';

export const initDB = async () => {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs({
    // Using a CDN for the wasm file
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  });

  const savedDB = localStorage.getItem(DB_SAVE_KEY);

  if (savedDB) {
    try {
      // Load existing database from LocalStorage
      const u8array = new Uint8Array(JSON.parse(savedDB));
      dbInstance = new SQL.Database(u8array);
      console.log("Database loaded from persistence");
    } catch (e) {
      console.error("Failed to load saved database:", e);
      dbInstance = new SQL.Database();
      seedDatabase();
    }
  } else {
    dbInstance = new SQL.Database();
    seedDatabase();
  }

  return dbInstance;
};

const seedDatabase = () => {
  if (!dbInstance) return;

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);

    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT,
      type TEXT,
      parentId TEXT,
      size TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS registry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      type TEXT DEFAULT 'REG_SZ'
    );

    CREATE TABLE IF NOT EXISTS hardware (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS system_state (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    INSERT OR IGNORE INTO system_state (key, value) VALUES ('installation_status', 'pending');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'dark'), ('wallpaper', 'default');
    
    INSERT OR IGNORE INTO hardware (key, value) VALUES 
    ('cpu', 'Intel Core i9-13900K'),
    ('ram', '32GB DDR5'),
    ('storage', '2TB NVMe SSD');

    INSERT OR IGNORE INTO registry (path, key, value) VALUES 
    ('HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control', 'ServiceManager', 'Running'),
    ('HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager', 'BootState', 'Healthy'),
    ('HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer', 'TaskbarAl', '1'),
    ('HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'ProductName', 'Windows 11 SQL Enterprise');

    -- Ensure no demo files exist
    DELETE FROM files;
  `);
  saveDB();
};

export const saveDB = () => {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const array = Array.from(data);
  localStorage.setItem(DB_SAVE_KEY, JSON.stringify(array));
};

export const getDB = () => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call initDB first.");
  }
  return dbInstance;
};

export const runQuery = (sql: string) => {
  const db = getDB();
  try {
    const res = db.exec(sql);

    // Auto-save on mutations (INSERT, UPDATE, DELETE, CREATE, DROP)
    const mutationKeywords = ['INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'REPLACE'];
    if (mutationKeywords.some(keyword => sql.toUpperCase().includes(keyword))) {
      saveDB();
    }

    if (res.length === 0) return [];

    // Transform sql.js result format to array of objects
    const columns = res[0].columns;
    const values = res[0].values;
    return values.map(row => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  } catch (err) {
    console.error("SQL Error:", err);
    throw err;
  }
};
