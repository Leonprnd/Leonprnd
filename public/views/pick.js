// Scherm "Pakken": Dean kiest de kast, pakt de onderdelen en geeft aan
// het eind aan of alles compleet was of dat er iets mist.

import {
  api, loadData, openPicklists, partById, picklistById, picklistProgress, picklists, PICKLIST_STATUS,
} from '../data.js';
import {
  cabinetTag, el, emptyState, formatAgo, icon, openModal, partThumb, plural, stepper, toast,
} from '../ui.js';
import { holdView, navigate } from '../router.js';

let session = null;
let saveTimer = null;

export function render(params) {
  if (params[0]) return pickView(params[0]);
  return chooseView();
}

/* ------------------------------------------------------------------ kast kiezen */

function chooseView() {
  const open = openPicklists();
  const recent = picklists().filter((list) => !['open', 'busy'].includes(list.status)).slice(0, 5);

  const search = el('input', {
    class: 'input', type: 'search', placeholder: 'Kastnummer intypen…', inputmode: 'numeric',
    style: { fontSize: '17px' },
    onInput: (event) => {
      const query = event.target.value.trim().toLowerCase();
      for (const card of cards.children) {
        const match = (card.dataset.search || '').includes(query);
        card.style.display = match ? '' : 'none';
      }
    },
  });

  const cards = el('div', { class: 'card-body tight' }, open.length
    ? open.map(openListRow)
    : emptyState('Geen openstaande kastlijsten', 'Roy heeft nu niets klaargezet om te pakken.'));

  return {
    title: 'Onderdelen pakken',
    subtitle: 'Kies de kast die je gaat maken',
    node: el('div', {},
      el('div', { class: 'toolbar' }, el('div', { class: 'search' }, icon('search'), search)),
      el('div', { class: 'card' },
        el('div', { class: 'card-head' },
          el('h2', { text: 'Klaar om te pakken' }),
          el('span', { class: 'sub', text: plural(open.length, 'kastlijst', 'kastlijsten') }),
        ),
        cards,
      ),
      recent.length ? el('div', { class: 'card' },
        el('div', { class: 'card-head' }, el('h2', { text: 'Laatst afgerond' })),
        el('div', { class: 'card-body tight' }, recent.map((list) => {
          const status = PICKLIST_STATUS[list.status];
          return el('div', { class: 'list-card', onClick: () => navigate(`/kastlijsten/${list.id}`) },
            cabinetTag(list.cabinetNumber),
            el('div', { class: 'info' },
              el('h3', { text: list.title || 'Kastlijst' }),
              el('div', { class: 'meta', text: `${list.completedBy || ''} · ${formatAgo(list.completedAt)}` })),
            el('span', { class: `pill ${status.tone}`, text: status.label }),
          );
        })),
      ) : null,
    ),
  };
}

function openListRow(list) {
  const progress = picklistProgress(list);
  return el('div', {
    class: 'list-card',
    dataset: { search: `${list.cabinetNumber} ${list.title}`.toLowerCase() },
    onClick: () => navigate(`/pakken/${list.id}`),
  },
  cabinetTag(list.cabinetNumber, true),
  el('div', { class: 'info' },
    el('h3', { text: list.title || 'Kastlijst' }),
    el('div', { class: 'meta', text: `${plural(list.lines.length, 'onderdeel', 'onderdelen')} · ${progress.total} stuks` }),
  ),
  el('div', { class: 'right' },
    list.status === 'busy'
      ? el('span', { class: 'pill warn', text: `Bezig: ${list.startedBy || ''}` })
      : el('span', { class: 'pill primary', text: 'Klaar om te pakken' }),
    el('button', { class: 'btn primary', type: 'button', onClick: () => navigate(`/pakken/${list.id}`) }, icon('pick'), 'Pakken'),
  ));
}

/* ------------------------------------------------------------------ pakken */

function pickView(listId) {
  const list = picklistById(listId);
  if (!list) return { title: 'Pakken', node: emptyState('Kastlijst niet gevonden', '', backButton()) };
  if (!['open', 'busy'].includes(list.status)) {
    return {
      title: `Kast ${list.cabinetNumber}`,
      node: emptyState('Deze kastlijst is al afgerond', 'Bekijk de lijst om te zien wat er gepakt is.',
        el('button', { class: 'btn primary', type: 'button', onClick: () => navigate(`/kastlijsten/${list.id}`) }, 'Kastlijst bekijken')),
    };
  }

  holdView(true);
  if (!session || session.listId !== list.id) {
    session = { listId: list.id, picked: new Map(list.lines.map((line) => [line.partId, line.pickedQty || 0])) };
    if (list.status === 'open') api(`/api/picklists/${list.id}/start`, { method: 'POST' }).catch(() => {});
  }

  const rows = el('div', {});
  const summary = el('div', { class: 'summary' });
  const progressBar = el('i');

  const totals = () => {
    const need = list.lines.reduce((sum, line) => sum + line.qty, 0);
    const got = list.lines.reduce((sum, line) => sum + Math.min(session.picked.get(line.partId) || 0, line.qty), 0);
    return { need, got, complete: got >= need };
  };

  const redraw = () => {
    rows.replaceChildren(...list.lines.map((line) => pickRow(line, redraw)));
    const { need, got, complete } = totals();
    summary.replaceChildren(
      el('strong', { text: `${got} van ${need} stuks gepakt` }),
      el('span', { text: complete ? ' – alles compleet' : ` – ${need - got} nog te gaan` }),
    );
    progressBar.style.width = `${need ? Math.round((got / need) * 100) : 0}%`;
    scheduleSave();
  };

  const scheduleSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        await api(`/api/picklists/${list.id}/progress`, {
          method: 'POST',
          body: { lines: list.lines.map((line) => ({ partId: line.partId, pickedQty: session.picked.get(line.partId) || 0 })) },
        });
      } catch {
        /* tussentijds opslaan mag stilletjes mislukken, bij afronden gaat alles mee */
      }
    }, 900);
  };

  const header = el('div', { class: 'pick-header' },
    el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Terug', onClick: () => { session = null; navigate('/pakken'); } }, icon('back')),
    cabinetTag(list.cabinetNumber, true),
    el('div', { style: { flex: '1', minWidth: '160px' } },
      el('h2', { text: list.title || 'Kastlijst' }),
      list.note ? el('div', { class: 'small muted', text: list.note }) : null,
    ),
    el('div', { class: 'progress', style: { width: '160px' } },
      el('div', { class: 'bar' }, progressBar),
      el('div', { class: 'txt' }, summary),
    ),
  );

  const footer = el('div', { class: 'pick-foot' },
    el('div', { class: 'summary' }, 'Alles gepakt? Rond de lijst af zodat de voorraad klopt.'),
    el('div', { style: { marginLeft: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' } },
      el('button', { class: 'btn lg', type: 'button', onClick: () => askMissing(list, redraw) }, icon('alert'), 'Er mist iets'),
      el('button', { class: 'btn ok lg', type: 'button', onClick: () => finish(list, true) }, icon('check'), 'Alles gepakt'),
    ),
  );

  redraw();

  return {
    title: `Kast ${list.cabinetNumber}`,
    subtitle: 'Vink af wat je gepakt hebt',
    node: el('div', { class: 'card', style: { overflow: 'hidden' } }, header, rows, footer),
  };
}

function pickRow(line, redraw) {
  const part = partById(line.partId) || { name: 'Onbekend onderdeel', number: '', unit: 'stuks', photo: '', location: '' };
  const picked = session.picked.get(line.partId) || 0;
  const done = picked >= line.qty;
  const short = picked > 0 && picked < line.qty;

  return el('div', { class: `pick-row${done ? ' done' : short ? ' short' : ''}` },
    partThumb(part, 'lg'),
    el('div', { class: 'meta' },
      el('div', { class: 'name', text: part.name }),
      el('div', { class: 'sub', text: `${part.number} · locatie ${part.location || 'onbekend'} · ${part.available} vrij op voorraad` }),
    ),
    el('div', { class: 'need' },
      el('div', { class: 'value', text: String(line.qty) }),
      el('div', { class: 'label', text: `nodig (${part.unit})` }),
    ),
    stepper(picked, (value) => { session.picked.set(line.partId, value); redraw(); }, { min: 0, max: line.qty }),
    el('button', {
      class: `check${done ? ' on' : ''}`, type: 'button', 'aria-label': `${part.name} gepakt`,
      onClick: () => { session.picked.set(line.partId, done ? 0 : line.qty); redraw(); },
    }, icon('check')),
  );
}

function backButton() {
  return el('button', { class: 'btn ghost', type: 'button', onClick: () => navigate('/pakken'), style: { marginTop: '12px' } }, icon('back'), 'Terug');
}

/* ------------------------------------------------------------------ afronden */

function askMissing(list, redraw) {
  const rows = el('div', {});
  const draw = () => {
    rows.replaceChildren(...list.lines.map((line) => {
      const part = partById(line.partId) || { name: 'Onbekend', number: '', unit: 'stuks', photo: '' };
      const picked = session.picked.get(line.partId) || 0;
      const missing = Math.max(0, line.qty - picked);
      return el('div', { class: 'picked-line' },
        partThumb(part),
        el('div', { class: 'meta' },
          el('div', { class: 'name', text: part.name }),
          el('div', { class: 'sub small muted', text: `${line.qty} nodig · ${picked} gepakt` }),
        ),
        missing
          ? el('span', { class: 'pill danger', text: `${missing} mist` })
          : el('span', { class: 'pill ok', text: 'compleet' }),
        stepper(picked, (value) => { session.picked.set(line.partId, value); draw(); redraw(); }, { min: 0, max: line.qty, small: true }),
      );
    }));
  };
  draw();

  openModal({
    title: 'Wat mist er?',
    wide: true,
    body: el('div', {},
      el('p', { class: 'small muted', text: 'Zet per onderdeel het aantal dat je écht gepakt hebt. Wat overblijft geven we door aan Roy zodat hij kan bijbestellen.' }),
      rows,
    ),
    actions: [
      { label: 'Terug naar de lijst' },
      {
        label: 'Tekort doorgeven en afronden', tone: 'danger',
        onClick: (close) => { close(); finish(list, false); },
      },
    ],
  });
}

async function finish(list, complete) {
  const lines = list.lines.map((line) => ({
    partId: line.partId,
    pickedQty: complete ? line.qty : (session.picked.get(line.partId) || 0),
  }));
  const missing = complete ? [] : list.lines
    .map((line) => ({ line, missing: line.qty - (session.picked.get(line.partId) || 0) }))
    .filter((entry) => entry.missing > 0);

  if (!complete && !missing.length) {
    toast('Er mist niets – rond af met "Alles gepakt".');
    return;
  }

  try {
    clearTimeout(saveTimer);
    await api(`/api/picklists/${list.id}/complete`, { method: 'POST', body: { complete, lines } });
    await loadData();
    session = null;
    if (complete) {
      toast(`Kast ${list.cabinetNumber} compleet gepakt`, 'ok');
      navigate('/pakken');
    } else {
      const text = missing.map((entry) => `${entry.missing} x ${(partById(entry.line.partId) || {}).name}`).join(', ');
      openModal({
        title: 'Doorgegeven aan Roy',
        body: el('div', {},
          el('p', {}, el('strong', { text: 'Dit staat nu op de bestellijst van Roy:' })),
          el('p', { text }),
          el('p', { class: 'small muted', text: 'De rest van de onderdelen is van de voorraad afgehaald.' }),
        ),
        actions: [{ label: 'Klaar', tone: 'primary', onClick: (close) => { close(); navigate('/pakken'); } }],
      });
    }
  } catch (err) {
    toast(err.message, 'error');
  }
}
