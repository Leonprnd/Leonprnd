// Gegevens ophalen en bewaren. Alle schermen lezen uit `state.data`.

export const state = {
  data: null,
  user: localStorage.getItem('gebruiker') || 'Roy',
  status: 'idle',
  lastSync: null,
};

export const USERS = ['Roy', 'Dean', 'Werkplaats'];

const listeners = new Set();

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn();
}

export function setUser(name) {
  state.user = name;
  localStorage.setItem('gebruiker', name);
  emit();
}

export async function api(path, { method = 'GET', body } = {}) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify({ user: state.user, ...body });
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Er ging iets mis. Probeer het opnieuw.');
  return payload;
}

export async function loadData({ silent = false } = {}) {
  if (!silent) state.status = 'busy';
  try {
    state.data = await api('/api/state');
    state.status = 'ok';
    state.lastSync = new Date();
  } catch (err) {
    state.status = 'error';
    if (!silent) throw err;
  }
  emit();
  return state.data;
}

/* ------------------------------------------------------------- hulpfuncties */

export function parts() {
  return state.data ? state.data.parts : [];
}

export function partById(id) {
  return parts().find((part) => part.id === id) || null;
}

export function picklists() {
  return state.data ? state.data.picklists : [];
}

export function picklistById(id) {
  return picklists().find((list) => list.id === id) || null;
}

export function orders() {
  return state.data ? state.data.orders : [];
}

export function openPicklists() {
  return picklists().filter((list) => list.status === 'open' || list.status === 'busy');
}

export function toOrder() {
  return parts().filter((part) => part.status === 'order' || part.status === 'out' || part.shortage > 0);
}

export function nogTeTellen() {
  return parts().filter((part) => part.status === 'onbekend');
}

export function openOrders() {
  return orders().filter((order) => order.status === 'open');
}

export function shortageParts() {
  return parts().filter((part) => part.shortage > 0);
}

/** Zoeken op naam, nummer, categorie, leverancier of locatie. */
export function searchParts(term, list = parts()) {
  const query = term.trim().toLowerCase();
  if (!query) return list;
  const words = query.split(/\s+/);
  return list
    .map((part) => {
      const haystack = `${part.number} ${part.name} ${part.category} ${part.supplier} ${part.location}`.toLowerCase();
      if (!words.every((word) => haystack.includes(word))) return null;
      let score = 0;
      if (part.number.toLowerCase().startsWith(query)) score += 100;
      if (part.name.toLowerCase().startsWith(query)) score += 60;
      if (part.name.toLowerCase().includes(query)) score += 20;
      return { part, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.part.name.localeCompare(b.part.name, 'nl'))
    .map((hit) => hit.part);
}

export function picklistProgress(list) {
  const total = list.lines.reduce((sum, line) => sum + line.qty, 0);
  const picked = list.lines.reduce((sum, line) => sum + Math.min(line.pickedQty, line.qty), 0);
  return { total, picked, ratio: total ? picked / total : 0 };
}

export const PICKLIST_STATUS = {
  open: { label: 'Klaar om te pakken', tone: 'primary' },
  busy: { label: 'Wordt gepakt', tone: 'warn' },
  done: { label: 'Compleet gepakt', tone: 'ok' },
  incomplete: { label: 'Tekort gemeld', tone: 'danger' },
};
