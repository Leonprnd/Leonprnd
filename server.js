// Start het programma:  npm start
// Daarna te openen op http://localhost:4000 — of op het netwerkadres dat
// hieronder in beeld komt, zodat de laptop bij de kast er ook bij kan.

import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createStore } from './src/store.js';
import { createServer } from './src/http.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const store = await createStore(process.env.DATA_DIR || path.join(ROOT, 'data'));

createServer(store).listen(PORT, HOST, () => {
  console.log('Onderdelenbeheer draait.');
  console.log(`  Op deze computer : http://localhost:${PORT}`);
  for (const address of lanAddresses()) {
    console.log(`  In het netwerk   : http://${address}:${PORT}`);
  }
  console.log(`  Gegevens         : ${path.join(store.dataDir, 'db.json')}`);
});

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((net) => net && net.family === 'IPv4' && !net.internal)
    .map((net) => net.address);
}
