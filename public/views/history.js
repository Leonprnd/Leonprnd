// Scherm "Historie": wie heeft wat gepakt, besteld of aangepast.

import { state } from '../data.js';
import { el, emptyState, formatDateTime } from '../ui.js';
import { rerender } from '../router.js';

const TYPES = [
  { key: 'alle', label: 'Alles' },
  { key: 'picklist', label: 'Kastlijsten' },
  { key: 'shortage', label: 'Tekorten' },
  { key: 'order', label: 'Bestellingen' },
  { key: 'stock', label: 'Voorraad' },
  { key: 'part', label: 'Onderdelen' },
];

const ui = { type: 'alle' };

export function render() {
  const activity = (state.data.activity || []).filter((entry) => ui.type === 'alle' || entry.type === ui.type);

  return {
    title: 'Historie',
    subtitle: 'Alles wat er in het programma gebeurd is',
    node: el('div', {},
      el('div', { class: 'toolbar' }, el('div', { class: 'chips' }, TYPES.map((entry) => el('button', {
        class: `chip${ui.type === entry.key ? ' active' : ''}`, type: 'button',
        onClick: () => { ui.type = entry.key; rerender(); },
      }, entry.label)))),
      el('div', { class: 'card' }, activity.length
        ? el('div', { class: 'card-body' }, el('div', { class: 'timeline' }, activity.map((entry) => el('div', { class: 'item' },
          el('span', { class: `dot ${entry.type}` }),
          el('div', {},
            el('div', { text: entry.text }),
            entry.user ? el('div', { class: 'small muted', text: `door ${entry.user}` }) : null,
          ),
          el('span', { class: 'when', text: formatDateTime(entry.at) }),
        ))))
        : emptyState('Nog niets gebeurd', 'Zodra er gepakt of besteld wordt zie je het hier.')),
    ),
  };
}
