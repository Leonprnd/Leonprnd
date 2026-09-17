// Scherm "Bestellen": wat moet Roy bestellen, wat is onderweg en wat is binnen.

import { api, loadData, openOrders, orders, partById, parts, shortageParts, toOrder } from '../data.js';
import {
  confirmDialog, el, emptyState, field, formatAgo, formatDate, icon, openModal,
  partCell, plural, statusPill, toast,
} from '../ui.js';
import { navigate, rerender } from '../router.js';

export function render() {
  const advice = toOrder().sort((a, b) => rank(a) - rank(b) || a.available - b.available);
  const shortages = shortageParts();
  const open = openOrders();
  const received = orders().filter((order) => order.status === 'received').slice(0, 10);

  return {
    title: 'Bestellen',
    subtitle: 'Bestel op tijd, voordat een onderdeel op is',
    node: el('div', {},
      shortages.length ? shortageBanner(shortages) : null,
      el('div', { class: 'kpi-grid' },
        kpi('Te bestellen', advice.filter((p) => p.status !== 'ordered').length, 'onderdelen onder het bestelpunt', advice.some((p) => p.status === 'out') ? 'danger' : 'warn'),
        kpi('Tekorten uit de werkplaats', shortages.reduce((sum, p) => sum + p.shortage, 0), shortages.length ? `${plural(shortages.length, 'onderdeel', 'onderdelen')} gemeld` : 'niets gemeld', shortages.length ? 'danger' : 'ok'),
        kpi('Onderweg', open.length, 'openstaande bestellingen', 'info'),
        kpi('Deze maand ontvangen', orders().filter(isThisMonth).length, 'bestellingen verwerkt', 'ok'),
      ),
      adviceSection(advice),
      openOrderSection(open),
      receivedSection(received),
    ),
  };
}

function rank(part) {
  return part.shortage > 0 ? 0 : part.status === 'out' ? 1 : part.status === 'order' ? 2 : 3;
}

function isThisMonth(order) {
  if (order.status !== 'received' || !order.receivedAt) return false;
  const date = new Date(order.receivedAt);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function kpi(label, value, sub, tone = '') {
  return el('div', { class: `kpi ${tone}`.trim() },
    el('div', { class: 'label', text: label }),
    el('div', { class: 'value', text: String(value) }),
    el('div', { class: 'sub', text: sub }),
  );
}

function shortageBanner(shortages) {
  return el('div', { class: 'banner danger' },
    icon('alert'),
    el('div', {},
      el('strong', { text: 'De werkplaats komt onderdelen tekort. ' }),
      el('span', { text: shortages.map((part) => `${part.shortage} x ${part.name}`).join(', ') }),
    ),
  );
}

/* ------------------------------------------------------------------ advies */

function adviceSection(advice) {
  if (!advice.length) {
    return el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Nu bestellen' })),
      emptyState('Alles is op voorraad', 'Er staat op dit moment niets onder het bestelpunt.'),
    );
  }

  const groups = new Map();
  for (const part of advice) {
    const key = part.supplier || 'Zonder leverancier';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(part);
  }

  return el('div', {}, [...groups.entries()].map(([supplier, list]) => el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h2', { text: supplier }),
      el('span', { class: 'sub', text: plural(list.length, 'onderdeel', 'onderdelen') }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm', type: 'button', onClick: () => copyList(supplier, list) }, icon('list'), 'Kopieer bestellijst'),
    ),
    el('div', { class: 'card-body tight' }, el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
      el('thead', {}, el('tr', {},
        el('th', { text: 'Onderdeel' }),
        el('th', { class: 'num', text: 'Vrij' }),
        el('th', { class: 'num', text: 'Bestelpunt' }),
        el('th', { class: 'num', text: 'Tekort' }),
        el('th', { class: 'num', text: 'Advies' }),
        el('th', { text: 'Status' }),
        el('th', {}),
      )),
      el('tbody', {}, list.map((part) => el('tr', {},
        el('td', { class: 'clickable', onClick: () => navigate(`/onderdelen/${part.id}`) }, partCell(part)),
        el('td', { class: 'num num-strong', text: String(part.available) }),
        el('td', { class: 'num muted', text: String(part.minStock) }),
        el('td', { class: 'num' }, part.shortage
          ? el('span', { class: 'pill danger', text: String(part.shortage) })
          : el('span', { class: 'muted', text: '–' })),
        el('td', { class: 'num num-strong', text: String(part.suggestedOrderQty) }),
        el('td', {}, statusPill(part)),
        el('td', { class: 'actions' },
          part.shortage ? el('button', { class: 'btn sm', type: 'button', onClick: () => resolveShortage(part) }, 'Tekort afgehandeld') : null,
          el('button', { class: 'btn sm primary', type: 'button', onClick: () => openOrderDialog(part) }, 'Bestellen'),
        ),
      ))),
    ))),
  )));
}

async function copyList(supplier, list) {
  const text = [`Bestelling ${supplier} – ${formatDate(new Date().toISOString())}`, '']
    .concat(list.map((part) => `${part.suggestedOrderQty} x ${part.number}  ${part.name}`))
    .join('\n');
  try {
    await navigator.clipboard.writeText(text);
    toast('Bestellijst gekopieerd', 'ok');
  } catch {
    openModal({ title: `Bestellijst ${supplier}`, body: el('pre', { class: 'small', style: { whiteSpace: 'pre-wrap' }, text }) });
  }
}

/* ------------------------------------------------------------------ onderweg */

function openOrderSection(open) {
  return el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h2', { text: 'Onderweg' }),
      el('span', { class: 'sub', text: 'besteld, nog niet binnen' }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm', type: 'button', onClick: () => openOrderDialog(null) }, icon('plus'), 'Bestelling toevoegen'),
    ),
    open.length
      ? el('div', { class: 'card-body tight' }, el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
        el('thead', {}, el('tr', {},
          el('th', { text: 'Onderdeel' }),
          el('th', { class: 'num', text: 'Aantal' }),
          el('th', { text: 'Leverancier' }),
          el('th', { text: 'Besteld' }),
          el('th', { text: 'Opmerking' }),
          el('th', {}),
        )),
        el('tbody', {}, open.map((order) => {
          const part = partById(order.partId);
          return el('tr', {},
            el('td', {}, part ? partCell(part) : el('span', { class: 'muted', text: 'onbekend onderdeel' })),
            el('td', { class: 'num num-strong', text: String(order.qty) }),
            el('td', { class: 'small', text: order.supplier || '–' }),
            el('td', { class: 'small muted', text: `${formatAgo(order.createdAt)} · ${order.orderedBy || ''}` }),
            el('td', { class: 'small muted', text: order.note || '–' }),
            el('td', { class: 'actions' },
              el('button', { class: 'btn sm ghost', type: 'button', onClick: () => cancelOrder(order, part) }, 'Annuleren'),
              el('button', { class: 'btn sm ok', type: 'button', onClick: () => receiveDialog(order, part) }, icon('check'), 'Ontvangen'),
            ),
          );
        })),
      )))
      : emptyState('Niets onderweg', 'Zodra je iets bestelt zie je het hier terug.'),
  );
}

function receivedSection(received) {
  if (!received.length) return null;
  return el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h2', { text: 'Laatst ontvangen' })),
    el('div', { class: 'card-body tight' }, el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
      el('tbody', {}, received.map((order) => {
        const part = partById(order.partId);
        return el('tr', {},
          el('td', {}, part ? partCell(part) : el('span', { class: 'muted', text: 'onbekend onderdeel' })),
          el('td', { class: 'num num-strong', text: `+${order.receivedQty || order.qty}` }),
          el('td', { class: 'small muted', text: order.supplier || '–' }),
          el('td', { class: 'small muted nowrap', text: formatAgo(order.receivedAt) }),
        );
      })),
    ))),
  );
}

/* ------------------------------------------------------------------ acties */

export function openOrderDialog(part) {
  const list = parts();
  const select = el('select', { class: 'select' },
    el('option', { value: '', text: 'Kies een onderdeel…' }),
    list.map((entry) => el('option', { value: entry.id, text: `${entry.number} – ${entry.name}`, selected: part && entry.id === part.id })),
  );
  const qty = el('input', { class: 'input', type: 'number', min: '1', value: String(part ? part.suggestedOrderQty : 1) });
  const supplier = el('input', { class: 'input', value: part ? part.supplier : '', list: 'leverancier-lijst' });
  const note = el('input', { class: 'input', placeholder: 'bijv. spoed, of levering volgende week' });
  const info = el('p', { class: 'small muted' });

  const updateInfo = () => {
    const chosen = partById(select.value);
    if (!chosen) { info.textContent = ''; return; }
    qty.value = String(chosen.suggestedOrderQty);
    supplier.value = chosen.supplier;
    info.textContent = `Vrij: ${chosen.available} ${chosen.unit} · bestelpunt ${chosen.minStock}${chosen.shortage ? ` · ${chosen.shortage} tekort gemeld` : ''}`;
  };
  select.addEventListener('change', updateInfo);
  if (part) updateInfo();

  openModal({
    title: 'Bestelling plaatsen',
    body: el('div', { class: 'form-grid' },
      el('div', { class: 'field full' }, el('span', { text: 'Onderdeel' }), select, info),
      field('Aantal', qty),
      field('Leverancier', supplier),
      el('div', { class: 'field full' }, el('span', { text: 'Opmerking' }), note),
    ),
    actions: [
      { label: 'Annuleren' },
      {
        label: 'Bestelling opslaan', tone: 'primary',
        onClick: async (close) => {
          try {
            await api('/api/orders', {
              method: 'POST',
              body: { partId: select.value, qty: Number(qty.value), supplier: supplier.value, note: note.value },
            });
            await loadData();
            close();
            rerender();
            toast('Bestelling genoteerd', 'ok');
          } catch (err) {
            toast(err.message, 'error');
          }
        },
      },
    ],
  });
}

function receiveDialog(order, part) {
  const qty = el('input', { class: 'input', type: 'number', min: '1', value: String(order.qty) });
  openModal({
    title: 'Bestelling ontvangen',
    body: el('div', {},
      el('p', { class: 'small muted', text: `${part ? part.name : 'Onderdeel'} · besteld ${formatDate(order.createdAt)}` }),
      field('Hoeveel is er binnengekomen?', qty, 'Dit aantal wordt bij de voorraad opgeteld.'),
    ),
    actions: [
      { label: 'Annuleren' },
      {
        label: 'Bijboeken', tone: 'ok',
        onClick: async (close) => {
          try {
            await api(`/api/orders/${order.id}/receive`, { method: 'POST', body: { qty: Number(qty.value) } });
            await loadData();
            close();
            rerender();
            toast('Voorraad bijgewerkt', 'ok');
          } catch (err) {
            toast(err.message, 'error');
          }
        },
      },
    ],
  });
}

async function cancelOrder(order, part) {
  const ok = await confirmDialog({
    title: 'Bestelling annuleren?',
    text: `De bestelling van ${order.qty} x ${part ? part.name : 'dit onderdeel'} wordt verwijderd.`,
    confirmLabel: 'Annuleren',
  });
  if (!ok) return;
  try {
    await api(`/api/orders/${order.id}`, { method: 'DELETE' });
    await loadData();
    rerender();
    toast('Bestelling verwijderd', 'ok');
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function resolveShortage(part) {
  try {
    await api('/api/shortages/resolve', { method: 'POST', body: { partId: part.id } });
    await loadData();
    rerender();
    toast('Tekort afgehandeld', 'ok');
  } catch (err) {
    toast(err.message, 'error');
  }
}
