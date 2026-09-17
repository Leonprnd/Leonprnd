// Opslag: één JSON-bestand in de map data/. Klein, leesbaar en makkelijk
// te back-uppen (kopieer data/db.json). Schrijven gebeurt atomair en
// achter elkaar, zodat er niets kwijtraakt als Roy en Dean tegelijk werken.

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { seedDatabase } from './seed.js';

export async function createStore(dir) {
  const dataDir = path.resolve(dir);
  const uploadsDir = path.join(dataDir, 'uploads');
  const file = path.join(dataDir, 'db.json');
  await mkdir(uploadsDir, { recursive: true });

  let db;
  let queue = Promise.resolve();

  try {
    db = normalize(JSON.parse(await readFile(file, 'utf8')));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    db = seedDatabase();
    await persist();
  }

  async function persist() {
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 2));
    await rename(tmp, file);
  }

  return {
    dataDir,
    uploadsDir,
    /** Huidige gegevens (alleen lezen). */
    read: () => db,
    /** Wijzig de gegevens en sla ze op. De callback krijgt de database. */
    update(mutate) {
      const run = queue.then(async () => {
        const result = mutate(db);
        await persist();
        return result;
      });
      queue = run.catch(() => {});
      return run;
    },
  };
}

function normalize(db) {
  return {
    version: 1,
    parts: [],
    picklists: [],
    orders: [],
    activity: [],
    ...db,
  };
}

export function newId(prefix) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

/** Legt vast wat er gebeurd is, zodat je later kunt terugkijken. */
export function logEvent(db, type, text, user = '') {
  db.activity.unshift({ id: newId('ev'), type, text, user, at: new Date().toISOString() });
  if (db.activity.length > 500) db.activity.length = 500;
}
