// Scherm "Kastlijsten": Roy maakt per kastnummer een lijst met onderdelen.

import {
  api, loadData, partById, parts, picklistById, picklistProgress, picklists,
  PICKLIST_STATUS, searchParts,
} from '../data.js';
import {
  cabinetTag, confirmDialog, el, emptyState, formatAgo, formatDateTime, icon,
  partCell, partThumb, plural, stepper, toast,
} from '../ui.js';
import { holdView, navigate, rerender } from '../router.js';
import { openOrderDialog } from './orders.js';

const ui = { query: '', status: 'alle' };
let draft = null;

export function render(params) {
  if (params[0] === 'nieuw') return builderView(null);
  if (params[1] === 'wijzig') return builderView(params[0]);
  if (params[0]) return detailView(params[0]);
  return listView();
}

/* ------------------------------------------------------------------ overzicht */

function listView() {
  const all = picklists();
  const filtered = all.filter((list) => {
    if (ui.status === 'open' && !['open', 'busy'].includes(list.status)) return false;
    if (ui.status === 'incomplete' && list.status !== 'incomplete') return false;
    if (ui.status === 'done' && list.status !== 'done') return false;
    const query = ui.query.trim().toLowerCase();
    if (!query) return true;
    return `${list.cabinetNumber} ${list.title}`.toLowerCase().includes(query);
  });

  const toolbar = el('div', { class: 'toolbar' },
    el('div', { class: 'search' }, icon('search'),
      el('input', {
        class: 'input', type: 'search', value: ui.query, placeholder: 'Zoek op kastnummer of omschrijving…',
        onInput: (event) => { ui.query = event.target.value; rerender(); },
      })),
    el('div', { class: 'chips' }, [
      { key: 'alle', label: 'Alles', count: all.length },
      { key: 'open', label: 'Open', count: all.filter((l) => ['open', 'busy'].includes(l.status)).length },
      { key: 'incomplete', label: 'Tekort gemeld', count: all.filter((l) => l.status === 'incomplete').length },
      { key: 'done', label: 'Afgerond', count: all.filter((l) => l.status === 'done').length },
    ].map((entry) => el('button', {
      class: `chip${ui.status === entry.key ? ' active' : ''}`, type: 'button',
      onClick: () => { ui.status = entry.key; rerender(); },
    }, entry.label, el('span', { class: 'count', text: String(entry.count) })))),
    el('div', { class: 'spacer' }),
    el('button', { class: 'btn primary', type: 'button', onClick: () => navigate('/kastlijsten/nieuw') }, icon('plus'), 'Nieuwe kastlijst'),
  );

  return {
    title: 'Kastlijsten',
    subtitle: 'Per kastnummer alle onderdelen die nodig zijn',
    node: el('div', {}, toolbar, el('div', { class: 'card' },
      filtered.length
        ? el('div', { class: 'card-body tight' }, filtered.map(listRow))
        : emptyState('Geen kastlijsten gevonden', 'Maak een nieuwe lijst voor de kast die gemaakt wordt.',
          el('button', { class: 'btn primary', type: 'button', onClick: () => navigate('/kastlijsten/nieuw') }, 'Nieuwe kastlijst')),
    )),
  };
}

function listRow(list) {
  const progress = picklistProgress(list);
  const status = PICKLIST_STATUS[list.status];
  return el('div', { class: 'list-card', onClick: () => navigate(`/kastlijsten/${list.id}`) },
    cabinetTag(list.cabinetNumber),
    el('div', { class: 'info' },
      el('h3', { text: list.title || 'Kastlijst' }),
      el('div', { class: 'meta', text: `${plural(list.lines.length, 'onderdeel', 'onderdelen')} · aangemaakt door ${list.createdBy} ${formatAgo(list.createdAt)}` }),
    ),
    el('div', { class: 'right' },
      list.status === 'busy' || list.status === 'open'
        ? el('div', { class: 'progress' },
          el('div', { class: 'bar' }, el('i', { style: { width: `${Math.round(progress.ratio * 100)}%` } })),
          el('div', { class: 'txt', text: `${progress.picked} / ${progress.total} gepakt` }))
        : null,
      el('span', { class: `pill ${status.tone}`, text: status.label }),
      icon('next'),
    ),
  );
}

/* ------------------------------------------------------------------ detail */

function detailView(id) {
  const list = picklistById(id);
  if (!list) return { title: 'Kastlijst', node: emptyState('Kastlijst niet gevonden', '', backButton()) };
  const status = PICKLIST_STATUS[list.status];
  const open = ['open', 'busy'].includes(list.status);
  const missing = list.lines.filter((line) => line.missingQty > 0);

  const header = el('div', { class: 'card' }, el('div', { class: 'card-body' },
    el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' } },
      cabinetTag(list.cabinetNumber, true),
      el('div', { style: { flex: '1', minWidth: '180px' } },
        el('h2', { text: list.title || 'Kastlijst' }),
        el('div', { class: 'small muted', text: `Aangemaakt door ${list.createdBy} op ${formatDateTime(list.createdAt)}` }),
        list.completedAt ? el('div', { class: 'small muted', text: `Gepakt door ${list.completedBy} op ${formatDateTime(list.completedAt)}` }) : null,
      ),
      el('span', { class: `pill ${status.tone}`, text: status.label }),
    ),
    list.note ? el('p', { class: 'small', style: { marginTop: '12px' }, text: list.note }) : null,
    el('div', { class: 'toolbar', style: { marginTop: '16px', marginBottom: 0 } },
      open ? el('button', { class: 'btn primary', type: 'button', onClick: () => navigate(`/pakken/${list.id}`) }, icon('pick'), 'Onderdelen pakken') : null,
      open ? el('button', { class: 'btn', type: 'button', onClick: () => navigate(`/kastlijsten/${list.id}/wijzig`) }, icon('edit'), 'Wijzigen') : null,
      el('button', { class: 'btn', type: 'button', onClick: () => window.print() }, icon('print'), 'Afdrukken'),
      open ? el('button', { class: 'btn danger', type: 'button', onClick: () => removeList(list) }, icon('trash'), 'Verwijderen') : null,
    ),
  ));

  const rows = list.lines.map((line) => {
    const part = partById(line.partId) || { name: 'Onbekend onderdeel', number: '', unit: 'stuks', photo: '' };
    return el('tr', {},
      el('td', {}, partCell(part)),
      el('td', { class: 'small muted', text: part.location || '–' }),
      el('td', { class: 'num num-strong', text: String(line.qty) }),
      el('td', { class: 'num', text: list.status === 'open' ? '–' : String(line.pickedQty) }),
      el('td', { class: 'num' }, line.missingQty
        ? el('span', { class: 'pill danger', text: `${line.missingQty} mist` })
        : el('span', { class: 'muted', text: '–' })),
    );
  });

  return {
    title: `Kast ${list.cabinetNumber}`,
    subtitle: list.title || 'Kastlijst',
    node: el('div', {},
      backButton(),
      missing.length ? el('div', { class: 'banner danger' },
        icon('alert'),
        el('div', {},
          el('strong', { text: 'Dean kwam onderdelen tekort: ' }),
          el('span', { text: missing.map((line) => `${line.missingQty} x ${(partById(line.partId) || {}).name || 'onbekend'}`).join(', ') }),
        ),
        el('div', { class: 'spacer' }),
        el('button', {
          class: 'btn sm primary', type: 'button',
          onClick: () => openOrderDialog(partById(missing[0].partId)),
        }, 'Bestellen'),
      ) : null,
      header,
      el('div', { class: 'card' },
        el('div', { class: 'card-head' }, el('h2', { text: 'Onderdelen' }), el('span', { class: 'sub', text: plural(list.lines.length, 'regel', 'regels') })),
        el('div', { class: 'card-body tight' }, el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
          el('thead', {}, el('tr', {},
            el('th', { text: 'Onderdeel' }),
            el('th', { text: 'Locatie' }),
            el('th', { class: 'num', text: 'Nodig' }),
            el('th', { class: 'num', text: 'Gepakt' }),
            el('th', { class: 'num', text: 'Mist' }),
          )),
          el('tbody', {}, rows),
        ))),
      ),
    ),
  };
}

function backButton() {
  return el('button', { class: 'btn ghost', type: 'button', style: { marginBottom: '14px' }, onClick: () => navigate('/kastlijsten') }, icon('back'), 'Terug naar kastlijsten');
}

async function removeList(list) {
  const ok = await confirmDialog({
    title: 'Kastlijst verwijderen?',
    text: `Kastlijst ${list.cabinetNumber} wordt verwijderd.`,
    confirmLabel: 'Verwijderen',
  });
  if (!ok) return;
  try {
    await api(`/api/picklists/${list.id}`, { method: 'DELETE' });
    await loadData();
    navigate('/kastlijsten');
    toast('Kastlijst verwijderd', 'ok');
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ------------------------------------------------------------------ opstellen */

function builderView(listId) {
  const existing = listId ? picklistById(listId) : null;
  if (listId && !existing) return { title: 'Kastlijst', node: emptyState('Kastlijst niet gevonden', '', backButton()) };

  holdView(true);
  if (!draft || draft.id !== (listId || 'nieuw')) {
    draft = existing
      ? {
        id: listId,
        cabinetNumber: existing.cabinetNumber,
        title: existing.title,
        note: existing.note,
        lines: existing.lines.map((line) => ({ partId: line.partId, qty: line.qty })),
        query: '',
      }
      : { id: 'nieuw', cabinetNumber: '', title: '', note: '', lines: [], query: '' };
  }

  const searchResults = el('div', { class: 'card-body tight builder-results' });
  const listBody = el('div', { class: 'card-body tight' });

  const drawResults = () => {
    const query = draft.query.trim();
    const matches = (query ? searchParts(query) : parts().slice().sort((a, b) => a.name.localeCompare(b.name, 'nl'))).slice(0, 40);
    searchResults.replaceChildren(...(matches.length
      ? matches.map((part) => {
        const onList = draft.lines.find((line) => line.partId === part.id);
        return el('div', { class: 'result-row' },
          partThumb(part),
          el('div', { class: 'meta' },
            el('div', { class: 'name', text: part.name }),
            el('div', { class: 'sub', text: `${part.number} · ${part.available} vrij · ${part.location || 'geen locatie'}` }),
          ),
          onList ? el('span', { class: 'pill primary', text: `${onList.qty} op lijst` }) : null,
          el('button', {
            class: 'btn sm primary', type: 'button',
            onClick: () => { addLine(part.id); drawResults(); drawList(); },
          }, icon('plus'), 'Toevoegen'),
        );
      })
      : [emptyState('Niets gevonden', 'Probeer een ander woord of nummer.')]));
  };

  const drawList = () => {
    listBody.replaceChildren(...(draft.lines.length
      ? draft.lines.map((line) => {
        const part = partById(line.partId);
        if (!part) return el('div');
        const warning = line.qty > part.available;
        return el('div', { class: 'picked-line' },
          partThumb(part),
          el('div', { class: 'meta' },
            el('div', { class: 'name', text: part.name }),
            el('div', { class: 'sub small muted', text: `${part.number} · ${part.available} vrij` }),
            warning ? el('div', { class: 'small', style: { color: 'var(--warn)' }, text: 'Meer dan er vrij is – bestel bij' }) : null,
          ),
          stepper(line.qty, (value) => {
            line.qty = value;
            if (value <= 0) draft.lines = draft.lines.filter((l) => l.partId !== line.partId);
            drawList();
            drawResults();
          }, { min: 0, small: true }),
          el('button', {
            class: 'icon-btn', type: 'button', 'aria-label': 'Van lijst halen',
            onClick: () => { draft.lines = draft.lines.filter((l) => l.partId !== line.partId); drawList(); drawResults(); },
          }, icon('trash')),
        );
      })
      : [emptyState('Nog geen onderdelen', 'Zoek links een onderdeel en klik op toevoegen.')]));
    totals.textContent = `${plural(draft.lines.length, 'onderdeel', 'onderdelen')} · ${draft.lines.reduce((sum, l) => sum + l.qty, 0)} stuks totaal`;
  };

  const addLine = (partId) => {
    const line = draft.lines.find((entry) => entry.partId === partId);
    if (line) line.qty += 1;
    else draft.lines.push({ partId, qty: 1 });
  };

  const cabinetInput = el('input', {
    class: 'input', value: draft.cabinetNumber, placeholder: 'bijv. 51436', inputmode: 'numeric',
    style: { fontSize: '19px', fontWeight: '650' },
    onInput: (event) => { draft.cabinetNumber = event.target.value; },
  });
  const titleInput = el('input', {
    class: 'input', value: draft.title, placeholder: 'bijv. Keukenkast onderbouw 600 mm',
    onInput: (event) => { draft.title = event.target.value; },
  });
  const noteInput = el('textarea', {
    class: 'textarea', value: draft.note, placeholder: 'Bijzonderheden voor de werkplaats',
    onInput: (event) => { draft.note = event.target.value; },
  });
  const totals = el('span', { class: 'sub' });

  const save = async () => {
    const payload = {
      cabinetNumber: draft.cabinetNumber,
      title: draft.title,
      note: draft.note,
      lines: draft.lines,
    };
    if (!payload.cabinetNumber.trim()) { toast('Vul eerst het kastnummer in.', 'error'); cabinetInput.focus(); return; }
    if (!payload.lines.length) { toast('Zet minimaal één onderdeel op de lijst.', 'error'); return; }
    try {
      const saved = draft.id === 'nieuw'
        ? await api('/api/picklists', { method: 'POST', body: payload })
        : await api(`/api/picklists/${draft.id}`, { method: 'PATCH', body: payload });
      draft = null;
      await loadData();
      toast('Kastlijst opgeslagen', 'ok');
      navigate(`/kastlijsten/${saved.id}`);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  drawResults();
  drawList();

  const node = el('div', { class: 'builder' },
    el('div', { class: 'card' },
      el('div', { class: 'card-head' },
        el('h2', { text: 'Onderdelen zoeken' }),
        el('span', { class: 'sub', text: 'op naam, nummer of locatie' }),
      ),
      el('div', { class: 'card-body' },
        el('div', { class: 'search', style: { maxWidth: 'none' } }, icon('search'),
          el('input', {
            class: 'input', type: 'search', value: draft.query, placeholder: 'Zoek een onderdeel…', autofocus: true,
            onInput: (event) => { draft.query = event.target.value; drawResults(); },
          })),
      ),
      searchResults,
    ),
    el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: draft.id === 'nieuw' ? 'Nieuwe kastlijst' : 'Kastlijst wijzigen' })),
      el('div', { class: 'card-body' },
        el('div', { class: 'form-grid' },
          el('div', { class: 'field' }, el('span', { text: 'Kastnummer' }), cabinetInput),
          el('div', { class: 'field' }, el('span', { text: 'Omschrijving' }), titleInput),
          el('div', { class: 'field full' }, el('span', { text: 'Opmerking' }), noteInput),
        ),
      ),
      el('div', { class: 'card-head' }, el('h2', { text: 'Op de lijst' }), totals),
      listBody,
      el('div', { class: 'pick-foot' },
        el('button', { class: 'btn', type: 'button', onClick: () => { draft = null; navigate('/kastlijsten'); } }, 'Annuleren'),
        el('div', { class: 'spacer', style: { marginLeft: 'auto' } }),
        el('button', { class: 'btn primary lg', type: 'button', onClick: save }, icon('save'), 'Kastlijst opslaan'),
      ),
    ),
  );

  return {
    title: draft.id === 'nieuw' ? 'Nieuwe kastlijst' : `Kast ${draft.cabinetNumber} wijzigen`,
    subtitle: 'Zoek de onderdelen bij elkaar en zet het kastnummer erbij',
    node,
  };
}
