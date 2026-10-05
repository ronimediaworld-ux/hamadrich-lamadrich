import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';

// בפיתוח (npm run dev) מפעיל אוטומטית גם את שרת ה-API (צפיות, תגובות, הצעות, עוזר AI) אם הוא לא רץ כבר —
// כך לא צריך לזכור להריץ npm run dev:full.
function autoStartApi(): Plugin {
  let child: ChildProcess | null = null;
  return {
    name: 'auto-start-api',
    apply: 'serve',
    configureServer(server) {
      const probe = net.connect(3001, '127.0.0.1');
      probe.once('connect', () => probe.destroy());
      probe.once('error', () => {
        child = spawn(process.execPath, ['server/index.js'], { stdio: 'inherit', env: { ...process.env, PORT: '3001' } });
        child.on('exit', () => { child = null; });
      });
      server.httpServer?.once('close', () => child?.kill());
    },
  };
}

export default defineConfig({
  plugins: [react(), autoStartApi()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
