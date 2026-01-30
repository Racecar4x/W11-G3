import { runQuery, initDB } from './sqlDB';

class SQLiteWrapper {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    await initDB();
    this.initialized = true;
  }

  async query(sql: string) {
    if (!this.initialized) await this.init();
    return runQuery(sql);
  }

  getSettings() {
    return {
      theme: 'dark',
      wallpaper: 'https://4kwallpapers.com/images/wallpapers/windows-11-bloom-dark-mode-stock-abstract-background-3840x2160-5645.jpg',
      taskbarAlignment: 'center',
    };
  }

  updateSetting(key: string, value: any) {
    this.query(`INSERT OR REPLACE INTO settings (key, value) VALUES ('${key}', '${value}')`);
  }

  async getFiles() {
    return this.query('SELECT * FROM files');
  }
}

export const db = new SQLiteWrapper();
