// Scherm "Overzicht": in één blik zien wat er besteld moet worden en
// welke kastlijsten nog open staan.

import {
  openOrders, openPicklists, parts, picklistProgress, shortageParts, state, toOrder,
} from '../data.js';
import { cabinetTag, el, emptyState, formatAgo, formatDateTime, icon, partCell, plural, statusPill } from '../ui.js';
import { navigate } from '../router.js';
import { openOrderDialog } from './orders.js';

export function render() {
  const advice = toOrder();
  const shortages = shortageParts();
  const open = openPicklists();
  const onTheWay = openOrders();
  const outOfStock = parts().filter((part) => part.status === 'out');

  return {
    title: 'Overzicht',
    subtitle: `Goedendag ${state.user}, dit is de stand van zaken`,
    node: el('div', {},
      shortages.length ? el('div', { class: 'banner danger' },
        icon('alert'),
        el('div', {},
          el('strong', { text: 'Uit de werkplaats: onderdelen tekort. ' }),
          el('span', { text: shortages.map((part) => `${part.shortage} x ${part.name}`).join(', ') }),
        ),
        el('div', { class: 'spacer' }),
        el('button', { class: 'btn sm', type: 'button', onClick: () => navigate('/bestellen') }, 'Naar bestellen'),
      ) : null,

      el('div', { class: 'kpi-grid' },
        kpi('Moet besteld worden', advice.filter((p) => p.status !== 'ordered').length, 'onder het bestelpunt', advice.length ? 'warn' : 'ok', '/bestellen'),
        kpi('Helemaal op', outOfStock.length, outOfStock.length ? outOfStock.map((p) => p.name).slice(0, 2).join(', ') : 'niets op', outOfStock.length ? 'danger' : 'ok', '/bestellen'),
        kpi('Open kastlijsten', open.length, 'klaar om te pakken', 'info', '/kastlijsten'),
        kpi('Onderweg', onTheWay.reduce((sum, order) => sum + order.qty, 0), `${plural(onTheWay.length, 'bestelling', 'bestellingen')} besteld`, '', '/bestellen'),
      ),

      el('div', { class: 'toolbar' },
        el('button', { class: 'btn primary', type: 'button', onClick: () => navigate('/kastlijsten/nieuw') }, icon('plus'), 'Nieuwe kastlijst'),
        el('button', { class: 'btn', type: 'button', onClick: () => navigate('/pakken') }, icon('pick'), 'Onderdelen pakken'),
        el('button', { class: 'btn', type: 'button', onClick: () => navigate('/onderdelen') }, icon('search'), 'Onderdeel opzoeken'),
      ),

      el('div', { class: 'grid cols-2' },
        orderCard(advice),
        el('div', {}, picklistCard(open), activityCard()),
      ),
    ),
  };
}

function kpi(label, value, sub, tone, href) {
  return el('a', { class: `kpi ${tone}`.trim(), href: `#${href}` },
    el('div', { class: 'label', text: label }),
    el('div', { class: 'value', text: String(value) }),
    el('div', { class: 'sub', text: sub }),
  );
}

function orderCard(advice) {
  const top = advice.slice(0, 8);
  return el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h2', { text: 'Bestellen voor het op is' }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm ghost', type: 'button', onClick: () => navigate('/bestellen') }, 'Alles bekijken', icon('next')),
    ),
    top.length
      ? el('div', { class: 'card-body tight' }, el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
        el('thead', {}, el('tr', {},
          el('th', { text: 'Onderdeel' }),
          el('th', { class: 'num', text: 'Vrij' }),
          el('th', { text: 'Status' }),
          el('th', {}),
        )),
        el('tbody', {}, top.map((part) => el('tr', {},
          el('td', { class: 'clickable', onClick: () => navigate(`/onderdelen/${part.id}`) }, partCell(part)),
          el('td', { class: 'num num-strong', text: String(part.available) }),
          el('td', {}, part.shortage ? el('span', { class: 'pill danger', text: `${part.shortage} tekort` }) : statusPill(part)),
          el('td', { class: 'actions' }, el('button', {
            class: 'btn sm primary', type: 'button', onClick: () => openOrderDialog(part),
          }, 'Bestellen')),
        ))),
      )))
      : emptyState('Niets te bestellen', 'Alle onderdelen zitten boven hun bestelpunt.'),
  );
}

function picklistCard(open) {
  return el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h2', { text: 'Openstaande kastlijsten' }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm ghost', type: 'button', onClick: () => navigate('/kastlijsten') }, 'Alles bekijken', icon('next')),
    ),
    open.length
      ? el('div', { class: 'card-body tight' }, open.slice(0, 6).map((list) => {
        const progress = picklistProgress(list);
        return el('div', { class: 'list-card', onClick: () => navigate(`/kastlijsten/${list.id}`) },
          cabinetTag(list.cabinetNumber),
          el('div', { class: 'info' },
            el('h3', { text: list.title || 'Kastlijst' }),
            el('div', { class: 'meta', text: `${plural(list.lines.length, 'onderdeel', 'onderdelen')} · ${formatAgo(list.createdAt)}` }),
          ),
          el('div', { class: 'right' },
            list.status === 'busy'
              ? el('span', { class: 'pill warn', text: `Bezig: ${list.startedBy || ''} (${progress.picked}/${progress.total})` })
              : el('span', { class: 'pill primary', text: 'Klaar om te pakken' }),
          ),
        );
      }))
      : emptyState('Geen open kastlijsten', 'Alles is gepakt.'),
  );
}

function activityCard() {
  const activity = (state.data.activity || []).slice(0, 8);
  return el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h2', { text: 'Laatste gebeurtenissen' }),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm ghost', type: 'button', onClick: () => navigate('/historie') }, 'Historie', icon('next')),
    ),
    el('div', { class: 'card-body' }, activity.length
      ? el('div', { class: 'timeline' }, activity.map((entry) => el('div', { class: 'item' },
        el('span', { class: `dot ${entry.type}` }),
        el('span', { text: entry.text }),
        el('span', { class: 'when', text: formatAgo(entry.at), title: formatDateTime(entry.at) }),
      )))
      : el('p', { class: 'muted small', text: 'Nog niets gebeurd.' })),
  );
}
