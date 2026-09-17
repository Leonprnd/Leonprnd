// REST-API van het programma. Alle schermen praten hiermee.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { logEvent, newId } from './store.js';
import { enrichParts, isOpenPicklist, orderAdvice } from './derive.js';

const ROUTES = [
  ['GET', /^\/api\/state$/, getState],
  ['POST', /^\/api\/parts$/, createPart],
  ['PATCH', /^\/api\/parts\/([\w-]+)$/, updatePart],
  ['DELETE', /^\/api\/parts\/([\w-]+)$/, deletePart],
  ['POST', /^\/api\/parts\/([\w-]+)\/stock$/, adjustStock],
  ['POST', /^\/api\/picklists$/, createPicklist],
  ['PATCH', /^\/api\/picklists\/([\w-]+)$/, updatePicklist],
  ['DELETE', /^\/api\/picklists\/([\w-]+)$/, deletePicklist],
  ['POST', /^\/api\/picklists\/([\w-]+)\/start$/, startPicklist],
  ['POST', /^\/api\/picklists\/([\w-]+)\/progress$/, savePickProgress],
  ['POST', /^\/api\/picklists\/([\w-]+)\/complete$/, completePicklist],
  ['POST', /^\/api\/orders$/, createOrder],
  ['POST', /^\/api\/orders\/([\w-]+)\/receive$/, receiveOrder],
  ['DELETE', /^\/api\/orders\/([\w-]+)$/, cancelOrder],
  ['POST', /^\/api\/shortages\/resolve$/, resolveShortage],
  ['POST', /^\/api\/uploads$/, uploadPhoto],
];

export async function handleApi(req, res, url, store) {
  for (const [method, pattern, handler] of ROUTES) {
    const match = url.pathname.match(pattern);
    if (!match) continue;
    if (req.method !== method) continue;
    try {
      const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readBody(req) : {};
      const result = await handler({ store, body, params: match.slice(1), url });
      return send(res, 200, result ?? { ok: true });
    } catch (err) {
      const status = err.status || 500;
      if (status >= 500) console.error(err);
      return send(res, status, { error: err.message || 'Onbekende fout' });
    }
  }
  return send(res, 404, { error: 'Onbekend API-pad' });
}

/* ---------------------------------------------------------------- state */

function getState({ store }) {
  const db = store.read();
  const parts = enrichParts(db);
  return {
    parts,
    picklists: db.picklists,
    orders: db.orders,
    activity: db.activity.slice(0, 60),
    advice: orderAdvice(parts).map((p) => p.id),
    categories: [...new Set(db.parts.map((p) => p.category).filter(Boolean))].sort(),
    suppliers: [...new Set(db.parts.map((p) => p.supplier).filter(Boolean))].sort(),
    serverTime: new Date().toISOString(),
  };
}

/* -------------------------------------------------------------- onderdelen */

function partFields(body, base = {}) {
  const part = {
    number: text(body.number ?? base.number),
    name: text(body.name ?? base.name),
    category: text(body.category ?? base.category),
    unit: text(body.unit ?? base.unit) || 'stuks',
    stock: int(body.stock ?? base.stock),
    minStock: int(body.minStock ?? base.minStock),
    orderQty: int(body.orderQty ?? base.orderQty),
    supplier: text(body.supplier ?? base.supplier),
    location: text(body.location ?? base.location),
    photo: text(body.photo ?? base.photo),
    notes: text(body.notes ?? base.notes),
    geteld: body.geteld === undefined ? true : Boolean(body.geteld),
  };
  assert(part.name, 'Geef een naam op voor het onderdeel.');
  assert(part.number, 'Geef een artikelnummer op.');
  return part;
}

function createPart({ store, body }) {
  return store.update((db) => {
    const fields = partFields(body);
    assert(
      !db.parts.some((p) => p.number.toLowerCase() === fields.number.toLowerCase()),
      `Artikelnummer ${fields.number} bestaat al.`,
    );
    const part = { id: newId('on'), createdAt: new Date().toISOString(), ...fields };
    db.parts.push(part);
    logEvent(db, 'part', `Onderdeel ${part.number} – ${part.name} toegevoegd`, text(body.user));
    return part;
  });
}

function updatePart({ store, body, params }) {
  return store.update((db) => {
    const part = find(db.parts, params[0], 'Onderdeel niet gevonden.');
    const fields = partFields(body, part);
    assert(
      !db.parts.some((p) => p.id !== part.id && p.number.toLowerCase() === fields.number.toLowerCase()),
      `Artikelnummer ${fields.number} bestaat al.`,
    );
    const stockChanged = fields.stock !== part.stock;
    Object.assign(part, fields);
    logEvent(db, 'part', `Onderdeel ${part.number} – ${part.name} aangepast`, text(body.user));
    if (stockChanged) {
      logEvent(db, 'stock', `Voorraad ${part.number} handmatig op ${part.stock} gezet`, text(body.user));
    }
    return part;
  });
}

function deletePart({ store, params, body }) {
  return store.update((db) => {
    const part = find(db.parts, params[0], 'Onderdeel niet gevonden.');
    const inUse = db.picklists.some(
      (list) => isOpenPicklist(list) && list.lines.some((l) => l.partId === part.id),
    );
    assert(!inUse, 'Dit onderdeel staat nog op een openstaande kastlijst.');
    db.parts = db.parts.filter((p) => p.id !== part.id);
    db.orders = db.orders.filter((o) => o.partId !== part.id || o.status !== 'open');
    logEvent(db, 'part', `Onderdeel ${part.number} – ${part.name} verwijderd`, text(body.user));
    return { ok: true };
  });
}

function adjustStock({ store, body, params }) {
  return store.update((db) => {
    const part = find(db.parts, params[0], 'Onderdeel niet gevonden.');
    const before = part.stock;
    if (body.set !== undefined && body.set !== null && body.set !== '') {
      part.stock = Math.max(0, int(body.set));
    } else {
      part.stock = Math.max(0, part.stock + int(body.delta));
    }
    part.geteld = true;
    const reason = text(body.reason) || 'handmatige correctie';
    logEvent(
      db,
      'stock',
      `Voorraad ${part.number} van ${before} naar ${part.stock} (${reason})`,
      text(body.user),
    );
    return part;
  });
}

/* -------------------------------------------------------------- kastlijsten */

function picklistLines(db, rawLines) {
  assert(Array.isArray(rawLines) && rawLines.length, 'Zet minimaal één onderdeel op de lijst.');
  const merged = new Map();
  for (const raw of rawLines) {
    const part = db.parts.find((p) => p.id === raw.partId);
    assert(part, 'Onbekend onderdeel op de lijst.');
    const qty = int(raw.qty);
    assert(qty > 0, `Vul een aantal in bij ${part.name}.`);
    const existing = merged.get(part.id);
    if (existing) existing.qty += qty;
    else {
      merged.set(part.id, {
        partId: part.id,
        qty,
        pickedQty: int(raw.pickedQty),
        missingQty: int(raw.missingQty),
        missingHandled: Boolean(raw.missingHandled),
        picked: Boolean(raw.picked),
      });
    }
  }
  return [...merged.values()];
}

function createPicklist({ store, body }) {
  return store.update((db) => {
    const cabinetNumber = text(body.cabinetNumber);
    assert(cabinetNumber, 'Vul het kastnummer in.');
    const list = {
      id: newId('kl'),
      cabinetNumber,
      title: text(body.title),
      note: text(body.note),
      status: 'open',
      createdBy: text(body.user) || 'Roy',
      createdAt: new Date().toISOString(),
      startedBy: null,
      startedAt: null,
      completedBy: null,
      completedAt: null,
      lines: picklistLines(db, body.lines),
    };
    db.picklists.unshift(list);
    logEvent(db, 'picklist', `Kastlijst ${list.cabinetNumber} aangemaakt (${list.lines.length} onderdelen)`, list.createdBy);
    return list;
  });
}

function updatePicklist({ store, body, params }) {
  return store.update((db) => {
    const list = find(db.picklists, params[0], 'Kastlijst niet gevonden.');
    assert(isOpenPicklist(list), 'Deze kastlijst is al afgerond en kan niet meer gewijzigd worden.');
    if (body.cabinetNumber !== undefined) {
      const cabinetNumber = text(body.cabinetNumber);
      assert(cabinetNumber, 'Vul het kastnummer in.');
      list.cabinetNumber = cabinetNumber;
    }
    if (body.title !== undefined) list.title = text(body.title);
    if (body.note !== undefined) list.note = text(body.note);
    if (body.lines !== undefined) list.lines = picklistLines(db, body.lines);
    logEvent(db, 'picklist', `Kastlijst ${list.cabinetNumber} aangepast`, text(body.user));
    return list;
  });
}

function deletePicklist({ store, params, body }) {
  return store.update((db) => {
    const list = find(db.picklists, params[0], 'Kastlijst niet gevonden.');
    assert(isOpenPicklist(list), 'Een afgeronde kastlijst blijft in de historie staan.');
    db.picklists = db.picklists.filter((l) => l.id !== list.id);
    logEvent(db, 'picklist', `Kastlijst ${list.cabinetNumber} verwijderd`, text(body.user));
    return { ok: true };
  });
}

function startPicklist({ store, params, body }) {
  return store.update((db) => {
    const list = find(db.picklists, params[0], 'Kastlijst niet gevonden.');
    assert(isOpenPicklist(list), 'Deze kastlijst is al afgerond.');
    if (list.status === 'open') {
      list.status = 'busy';
      list.startedBy = text(body.user) || 'Dean';
      list.startedAt = new Date().toISOString();
      logEvent(db, 'picklist', `Kastlijst ${list.cabinetNumber} wordt gepakt`, list.startedBy);
    }
    return list;
  });
}

/** Tussentijds opslaan tijdens het pakken; voorraad verandert nog niet. */
function savePickProgress({ store, params, body }) {
  return store.update((db) => {
    const list = find(db.picklists, params[0], 'Kastlijst niet gevonden.');
    assert(isOpenPicklist(list), 'Deze kastlijst is al afgerond.');
    applyPickedQuantities(list, body.lines);
    return list;
  });
}

function applyPickedQuantities(list, rawLines) {
  const updates = new Map((rawLines || []).map((l) => [l.partId, l]));
  for (const line of list.lines) {
    const update = updates.get(line.partId);
    if (!update) continue;
    const picked = clamp(int(update.pickedQty), 0, line.qty);
    line.pickedQty = picked;
    line.picked = update.picked !== undefined ? Boolean(update.picked) : picked >= line.qty;
  }
}

/**
 * Dean rondt af. Alles wat gepakt is gaat van de voorraad af, wat mist
 * blijft als tekort staan zodat Roy het kan bestellen.
 */
function completePicklist({ store, params, body }) {
  return store.update((db) => {
    const list = find(db.picklists, params[0], 'Kastlijst niet gevonden.');
    assert(isOpenPicklist(list), 'Deze kastlijst is al afgerond.');
    const user = text(body.user) || 'Dean';
    const complete = body.complete !== false;

    applyPickedQuantities(list, body.lines);
    if (complete) {
      for (const line of list.lines) {
        line.pickedQty = line.qty;
        line.picked = true;
        line.missingQty = 0;
      }
    } else {
      for (const line of list.lines) {
        line.missingQty = Math.max(0, line.qty - line.pickedQty);
        line.missingHandled = false;
      }
    }

    const shortages = [];
    for (const line of list.lines) {
      const part = db.parts.find((p) => p.id === line.partId);
      if (!part) continue;
      if (line.pickedQty > 0) part.stock = Math.max(0, part.stock - line.pickedQty);
      if (line.missingQty > 0) shortages.push(`${line.missingQty} x ${part.name}`);
    }

    list.status = shortages.length ? 'incomplete' : 'done';
    list.completedBy = user;
    list.completedAt = new Date().toISOString();
    if (text(body.note)) list.note = text(body.note);

    if (shortages.length) {
      logEvent(db, 'shortage', `Tekort op kastlijst ${list.cabinetNumber}: ${shortages.join(', ')}`, user);
    } else {
      logEvent(db, 'picklist', `Kastlijst ${list.cabinetNumber} compleet gepakt`, user);
    }
    return list;
  });
}

/* -------------------------------------------------------------- bestellingen */

function createOrder({ store, body }) {
  return store.update((db) => {
    const part = find(db.parts, text(body.partId), 'Onderdeel niet gevonden.');
    const qty = int(body.qty);
    assert(qty > 0, 'Vul een aantal in om te bestellen.');
    const order = {
      id: newId('bs'),
      partId: part.id,
      qty,
      supplier: text(body.supplier) || part.supplier,
      status: 'open',
      note: text(body.note),
      orderedBy: text(body.user) || 'Roy',
      createdAt: new Date().toISOString(),
      receivedAt: null,
      receivedQty: 0,
    };
    db.orders.unshift(order);
    logEvent(
      db,
      'order',
      `${order.qty} x ${part.name} besteld${order.supplier ? ` bij ${order.supplier}` : ''}`,
      order.orderedBy,
    );
    return order;
  });
}

function receiveOrder({ store, params, body }) {
  return store.update((db) => {
    const order = find(db.orders, params[0], 'Bestelling niet gevonden.');
    assert(order.status === 'open', 'Deze bestelling is al verwerkt.');
    const part = find(db.parts, order.partId, 'Onderdeel niet gevonden.');
    const qty = body.qty === undefined || body.qty === '' ? order.qty : int(body.qty);
    assert(qty > 0, 'Vul in hoeveel er binnengekomen is.');
    part.stock += qty;
    part.geteld = true;
    order.status = 'received';
    order.receivedQty = qty;
    order.receivedAt = new Date().toISOString();
    clearShortages(db, part.id);
    logEvent(db, 'order', `${qty} x ${part.name} ontvangen, voorraad nu ${part.stock}`, text(body.user));
    return order;
  });
}

function cancelOrder({ store, params, body }) {
  return store.update((db) => {
    const order = find(db.orders, params[0], 'Bestelling niet gevonden.');
    assert(order.status === 'open', 'Deze bestelling is al verwerkt.');
    const part = db.parts.find((p) => p.id === order.partId);
    db.orders = db.orders.filter((o) => o.id !== order.id);
    logEvent(db, 'order', `Bestelling van ${order.qty} x ${part ? part.name : 'onderdeel'} geannuleerd`, text(body.user));
    return { ok: true };
  });
}

function resolveShortage({ store, body }) {
  return store.update((db) => {
    const part = find(db.parts, text(body.partId), 'Onderdeel niet gevonden.');
    const count = clearShortages(db, part.id);
    logEvent(db, 'shortage', `Tekort op ${part.name} afgehandeld (${count} melding${count === 1 ? '' : 'en'})`, text(body.user));
    return { ok: true, count };
  });
}

function clearShortages(db, partId) {
  let count = 0;
  for (const list of db.picklists) {
    for (const line of list.lines) {
      if (line.partId === partId && line.missingQty > 0 && !line.missingHandled) {
        line.missingHandled = true;
        count += 1;
      }
    }
  }
  return count;
}

/* -------------------------------------------------------------- foto's */

const IMAGE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

async function uploadPhoto({ store, body }) {
  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(text(body.dataUrl));
  assert(match, 'Ongeldige afbeelding.');
  const ext = IMAGE_TYPES[match[1]];
  assert(ext, 'Gebruik een foto van het type PNG, JPG of WEBP.');
  const buffer = Buffer.from(match[2], 'base64');
  assert(buffer.length <= 5 * 1024 * 1024, 'De foto mag maximaal 5 MB zijn.');
  const name = `${newId('foto')}.${ext}`;
  await writeFile(path.join(store.uploadsDir, name), buffer);
  return { path: `/uploads/${name}` };
}

/* -------------------------------------------------------------- hulpjes */

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 8 * 1024 * 1024) {
        reject(httpError(413, 'Het bericht is te groot.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(httpError(400, 'Ongeldige gegevens ontvangen.'));
      }
    });
    req.on('error', reject);
  });
}

function send(res, status, data) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

function find(collection, id, message) {
  const item = collection.find((entry) => entry.id === id);
  assert(item, message, 404);
  return item;
}

function assert(condition, message, status = 400) {
  if (!condition) throw httpError(status, message);
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function text(value) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}

function int(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
