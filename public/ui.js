// Kleine bouwstenen voor de schermen: elementen maken, iconen, meldingen,
// dialoogvensters en opmaak van datums en aantallen.

// Deze namen zijn op het element alleen leesbaar; ze moeten als attribuut.
const SET_AS_ATTRIBUTE = new Set(['list', 'for', 'form', 'inputmode', 'autofocus']);

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (SET_AS_ATTRIBUTE.has(key) || key.includes('-')) node.setAttribute(key, value);
    else if (key in node && typeof value !== 'object') node[key] = value;
    else node.setAttribute(key, value);
  }
  append(node, children);
  return node;
}

export function append(node, children) {
  for (const child of children.flat(4)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}

/* ------------------------------------------------------------------ iconen */

const ICONS = {
  dashboard: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  parts: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  list: 'M9 4h6v3H9zM8 5H6a1 1 0 00-1 1v13a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-2M9 12h6M9 16h6',
  pick: 'M20 7L9.5 17.5 4 12',
  order: 'M3 5h2l2.2 10.2a1 1 0 001 .8h8.6a1 1 0 001-.8L20 8H6M10 20h.01M17 20h.01',
  history: 'M12 7v5l3.5 2M21 12a9 9 0 11-3-6.7M21 4v4h-4',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'M20 7L9.5 17.5 4 12',
  x: 'M6 6l12 12M18 6L6 18',
  alert: 'M12 9v4.5M12 17h.01M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z',
  edit: 'M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3zM14.5 6.5l3 3',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  print: 'M7 9V4h10v5M7 18H5a1 1 0 01-1-1v-6a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1h-2M7 14h10v6H7z',
  back: 'M19 12H5M11 18l-6-6 6-6',
  next: 'M9 6l6 6-6 6',
  camera: 'M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  cabinet: 'M5 3h14v18H5zM12 3v18M9 9h.01M15 9h.01',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 0114 0',
  save: 'M5 4h11l3 3v13H5zM8 4v6h7V4M8 15h8',
};

export function icon(name, size) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', String(size || 20));
  svg.setAttribute('height', String(size || 20));
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ICONS[name] || ICONS.box);
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.8');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return svg;
}

/* ------------------------------------------------------------------ opmaak */

const dateFmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' });

export function formatDate(iso) {
  if (!iso) return '–';
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso) {
  if (!iso) return '–';
  const date = new Date(iso);
  return `${dateFmt.format(date)} ${timeFmt.format(date)}`;
}

export function formatAgo(iso) {
  if (!iso) return '–';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'zojuist';
  if (minutes < 60) return `${minutes} min geleden`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} uur geleden`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'gisteren';
  if (days < 30) return `${days} dagen geleden`;
  return formatDate(iso);
}

export function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

/* ------------------------------------------------------------------ meldingen */

export function toast(message, tone = '') {
  const host = document.getElementById('toast-host');
  const node = el('div', { class: `toast ${tone}`.trim(), text: message });
  host.append(node);
  setTimeout(() => {
    node.style.transition = 'opacity .2s';
    node.style.opacity = '0';
    setTimeout(() => node.remove(), 220);
  }, tone === 'error' ? 5200 : 2800);
}

/* ------------------------------------------------------------------ dialoog */

let openModals = 0;

export function openModal({ title, body, actions = [], wide = false, onClose }) {
  const backdrop = el('div', { class: 'modal-backdrop' });
  const modal = el('div', { class: `modal${wide ? ' wide' : ''}` });

  function close() {
    backdrop.remove();
    openModals = Math.max(0, openModals - 1);
    document.removeEventListener('keydown', onKey);
    if (onClose) onClose();
  }
  function onKey(event) {
    if (event.key === 'Escape') close();
  }

  modal.append(
    el('div', { class: 'modal-head' },
      el('h2', { text: title }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Sluiten', onClick: close }, icon('x')),
    ),
    el('div', { class: 'modal-body' }, body),
  );
  if (actions.length) {
    modal.append(el('div', { class: 'modal-foot' }, actions.map((action) => {
      if (action instanceof Node) return action;
      return el('button', {
        class: `btn ${action.tone || ''}`.trim(),
        type: action.type || 'button',
        onClick: action.onClick ? () => action.onClick(close) : close,
      }, action.label);
    })));
  }

  backdrop.append(modal);
  backdrop.addEventListener('mousedown', (event) => {
    if (event.target === backdrop) close();
  });
  document.addEventListener('keydown', onKey);
  document.getElementById('modal-host').append(backdrop);
  openModals += 1;
  const focusable = modal.querySelector('input, select, textarea, button.btn');
  if (focusable) focusable.focus();
  return { close, modal };
}

export function modalsOpen() {
  return openModals > 0;
}

export function confirmDialog({ title, text, confirmLabel = 'Ja, doorgaan', tone = 'danger' }) {
  return new Promise((resolve) => {
    let answered = false;
    const { close } = openModal({
      title,
      body: el('p', { text }),
      actions: [
        { label: 'Annuleren', onClick: (done) => { answered = true; done(); resolve(false); } },
        { label: confirmLabel, tone, onClick: (done) => { answered = true; done(); resolve(true); } },
      ],
      onClose: () => {
        if (!answered) resolve(false);
      },
    });
    return close;
  });
}

/* ------------------------------------------------------------------ onderdeel */

export const PART_TONES = {
  out: { label: 'Op', tone: 'danger' },
  order: { label: 'Bestellen', tone: 'warn' },
  ordered: { label: 'Besteld', tone: 'info' },
  ok: { label: 'Op voorraad', tone: 'ok' },
};

export function statusPill(part) {
  const info = PART_TONES[part.status] || PART_TONES.ok;
  return el('span', { class: `pill ${info.tone}`, text: info.label });
}

export function partThumb(part, size = '') {
  return el('img', {
    class: `thumb ${size}`.trim(),
    src: part.photo || '/img/parts/placeholder.svg',
    alt: part.name,
    loading: 'lazy',
    onError: (event) => { event.target.src = '/img/parts/placeholder.svg'; },
  });
}

export function partCell(part) {
  return el('div', { class: 'part-cell' },
    partThumb(part),
    el('div', { class: 'meta' },
      el('span', { class: 'name', text: part.name }),
      el('span', { class: 'number', text: part.number }),
    ),
  );
}

export function stockBar(part) {
  const reference = Math.max(part.minStock * 2, part.stock, 1);
  const ratio = Math.max(0, Math.min(1, part.available / reference));
  const tone = part.status === 'out' ? 'danger' : part.status === 'ok' ? '' : 'warn';
  return el('div', { class: `stock-bar ${tone}`.trim() }, el('i', { style: { width: `${ratio * 100}%` } }));
}

/** Het kastnummer zoals het overal in beeld komt: "KAST 51436". */
export function cabinetTag(number, big = false) {
  return el('span', { class: `cabinet-tag${big ? ' lg' : ''}` },
    el('em', { text: 'Kast' }),
    el('span', { text: number }),
  );
}

export function emptyState(title, description, action) {
  return el('div', { class: 'empty' },
    icon('box', 42),
    el('h3', { text: title }),
    description ? el('p', { text: description }) : null,
    action || null,
  );
}

export function stepper(value, onChange, { min = 0, max = 9999, small = false } = {}) {
  const input = el('input', { type: 'number', value: String(value), min: String(min), max: String(max), inputmode: 'numeric' });
  const commit = (next) => {
    const clamped = Math.max(min, Math.min(max, Number.isFinite(next) ? next : min));
    input.value = String(clamped);
    onChange(clamped);
  };
  input.addEventListener('change', () => commit(Math.round(Number(input.value))));
  input.addEventListener('focus', () => input.select());
  return el('div', { class: `stepper${small ? ' sm' : ''}` },
    el('button', { type: 'button', 'aria-label': 'Minder', onClick: () => commit(Math.round(Number(input.value)) - 1) }, '−'),
    input,
    el('button', { type: 'button', 'aria-label': 'Meer', onClick: () => commit(Math.round(Number(input.value)) + 1) }, '+'),
  );
}

export function field(label, control, hint) {
  return el('label', { class: 'field' },
    el('span', { text: label }),
    control,
    hint ? el('span', { class: 'hint', text: hint }) : null,
  );
}
