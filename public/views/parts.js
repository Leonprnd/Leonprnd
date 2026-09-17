// Scherm "Onderdelen": de complete lijst met foto's, naam en nummer,
// met zoeken, filteren en het beheren van de voorraad.

import {
  api, loadData, partById, parts, picklists, searchParts, state,
} from '../data.js';
import {
  cabinetTag, confirmDialog, el, emptyState, field, formatAgo, formatDateTime, icon,
  openModal, partCell, partThumb, statusPill, stockBar, toast,
} from '../ui.js';
import { navigate, rerender } from '../router.js';
import { openOrderDialog } from './orders.js';

const ui = { query: '', filter: 'alle', category: '', layout: localStorage.getItem('onderdelen-weergave') || 'grid' };

const FILTERS = [
  { key: 'alle', label: 'Alles' },
  { key: 'order', label: 'Bestellen' },
  { key: 'ordered', label: 'Besteld' },
  { key: 'ok', label: 'Op voorraad' },
  { key: 'onbekend', label: 'Nog te tellen' },
];

export function render(params) {
  if (params[0]) return detailView(params[0]);
  return listView();
}

/* ------------------------------------------------------------------ overzicht */

function listView() {
  const all = parts();
  const matchesFilter = (part) => {
    if (ui.category && part.category !== ui.category) return false;
    if (ui.filter === 'alle') return true;
    if (ui.filter === 'order') return part.status === 'order' || part.status === 'out';
    return part.status === ui.filter;
  };
  const filtered = searchParts(ui.query, all.filter(matchesFilter));

  const search = el('input', {
    class: 'input',
    type: 'search',
    value: ui.query,
    placeholder: 'Zoek op naam, nummer, leverancier of locatie…',
    onInput: (event) => {
      ui.query = event.target.value;
      results.replaceChildren(resultsBody(filteredNow()));
      counter.textContent = label(filteredNow().length);
    },
  });

  const filteredNow = () => searchParts(ui.query, parts().filter(matchesFilter));
  const label = (count) => `${count} van ${all.length} onderdelen`;

  const toolbar = el('div', { class: 'toolbar' },
    el('div', { class: 'search' }, icon('search'), search),
    el('div', { class: 'chips' }, FILTERS.map((entry) => {
      const count = entry.key === 'alle'
        ? all.length
        : entry.key === 'order'
          ? all.filter((p) => p.status === 'order' || p.status === 'out').length
          : all.filter((p) => p.status === entry.key).length;
      return el('button', {
        class: `chip${ui.filter === entry.key ? ' active' : ''}`,
        type: 'button',
        onClick: () => { ui.filter = entry.key; rerender(); },
      }, entry.label, el('span', { class: 'count', text: String(count) }));
    })),
    el('div', { class: 'spacer' }),
    categorySelect(),
    el('button', {
      class: 'btn', type: 'button', title: 'Wisselen tussen foto\'s en tabel',
      onClick: () => {
        ui.layout = ui.layout === 'grid' ? 'table' : 'grid';
        localStorage.setItem('onderdelen-weergave', ui.layout);
        rerender();
      },
    }, icon(ui.layout === 'grid' ? 'list' : 'dashboard'), ui.layout === 'grid' ? 'Tabel' : 'Foto\'s'),
    el('button', { class: 'btn primary', type: 'button', onClick: () => openPartDialog(null) }, icon('plus'), 'Nieuw onderdeel'),
  );

  const counter = el('span', { class: 'sub', text: label(filtered.length) });
  const results = el('div', {}, resultsBody(filtered));

  return {
    title: 'Onderdelen',
    subtitle: 'Alle onderdelen met foto, naam en artikelnummer',
    node: el('div', {}, toolbar, el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Onderdelenlijst' }), counter),
      el('div', { class: 'card-body tight' }, results),
    )),
  };
}

function categorySelect() {
  const categories = state.data ? state.data.categories : [];
  const select = el('select', { class: 'select', style: { width: 'auto' }, onChange: (event) => { ui.category = event.target.value; rerender(); } },
    el('option', { value: '', text: 'Alle categorieën', selected: !ui.category }),
    categories.map((cat) => el('option', { value: cat, text: cat, selected: ui.category === cat })),
  );
  return select;
}

function resultsBody(list) {
  if (!list.length) {
    return emptyState('Geen onderdelen gevonden', 'Pas je zoekopdracht of filter aan.');
  }
  return ui.layout === 'grid' ? partGrid(list) : partTable(list);
}

function partGrid(list) {
  return el('div', { class: 'part-grid', style: { padding: '18px 20px' } }, list.map((part) =>
    el('button', { class: 'part-card', type: 'button', onClick: () => navigate(`/onderdelen/${part.id}`) },
      partThumb(part),
      el('div', { class: 'body' },
        el('span', { class: 'name', text: part.name }),
        el('span', { class: 'number', text: `${part.number} · ${part.category || 'geen categorie'}` }),
        el('div', { class: 'foot' },
          el('span', { class: 'num-strong muted', text: part.status === 'onbekend' ? '–' : `${part.available} ${part.unit} vrij` }),
          statusPill(part),
        ),
        stockBar(part),
      ),
    )));
}

function partTable(list) {
  return el('div', { class: 'table-wrap' }, el('table', { class: 'table' },
    el('thead', {}, el('tr', {},
      el('th', { text: 'Onderdeel' }),
      el('th', { text: 'Categorie' }),
      el('th', { text: 'Locatie' }),
      el('th', { class: 'num', text: 'Voorraad' }),
      el('th', { class: 'num', text: 'Gereserveerd' }),
      el('th', { class: 'num', text: 'Vrij' }),
      el('th', { class: 'num', text: 'Bestelpunt' }),
      el('th', { text: 'Status' }),
    )),
    el('tbody', {}, list.map((part) => el('tr', { class: 'clickable', onClick: () => navigate(`/onderdelen/${part.id}`) },
      el('td', {}, partCell(part)),
      el('td', { class: 'small muted', text: part.category || '–' }),
      el('td', { class: 'small muted', text: part.location || '–' }),
      el('td', { class: 'num num-strong', text: part.status === 'onbekend' ? '–' : String(part.stock) }),
      el('td', { class: 'num muted', text: part.reserved ? String(part.reserved) : '–' }),
      el('td', { class: 'num num-strong', text: part.status === 'onbekend' ? '–' : String(part.available) }),
      el('td', { class: 'num muted', text: String(part.minStock) }),
      el('td', {}, statusPill(part)),
    ))),
  ));
}

/* ------------------------------------------------------------------ detail */

function detailView(id) {
  const part = partById(id);
  if (!part) {
    return { title: 'Onderdeel', node: emptyState('Onderdeel niet gevonden', 'Het is misschien verwijderd.', backButton()) };
  }

  const usedOn = picklists().filter((list) => ['open', 'busy'].includes(list.status) && list.lines.some((line) => line.partId === part.id));
  const history = (state.data.activity || []).filter((entry) => entry.text.includes(part.number) || entry.text.includes(part.name)).slice(0, 8);

  const left = el('div', { class: 'card' },
    el('div', { class: 'card-body' },
      partThumb(part, 'xl'),
      el('div', { style: { display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' } },
        statusPill(part),
        part.shortage ? el('span', { class: 'pill danger', text: `${part.shortage} tekort gemeld` }) : null,
        part.onOrder ? el('span', { class: 'pill info', text: `${part.onOrder} onderweg` }) : null,
      ),
      el('div', { style: { display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' } },
        el('button', { class: 'btn primary', type: 'button', onClick: () => openOrderDialog(part) }, icon('order'), 'Bestellen'),
        el('button', { class: 'btn', type: 'button', onClick: () => openPartDialog(part) }, icon('edit'), 'Wijzigen'),
        el('button', { class: 'btn danger', type: 'button', onClick: () => removePart(part) }, icon('trash'), 'Verwijderen'),
      ),
    ),
  );

  const right = el('div', {},
    el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Voorraad' })),
      el('div', { class: 'card-body' },
        el('div', { class: 'kpi-grid', style: { marginBottom: '16px' } },
          kpi('Op voorraad', part.status === 'onbekend' ? '–' : part.stock, part.status === 'onbekend' ? 'nog niet geteld' : `${part.unit}`),
          kpi('Gereserveerd', part.reserved, 'voor open kastlijsten'),
          part.status === 'onbekend'
            ? kpi('Vrij te gebruiken', '–', 'tel dit onderdeel eerst')
            : kpi('Vrij te gebruiken', part.available, part.available <= part.minStock ? 'onder het bestelpunt' : 'ruim voldoende', part.available <= 0 ? 'danger' : part.available <= part.minStock ? 'warn' : 'ok'),
          kpi('Bestelpunt', part.minStock, `bestel per ${part.orderQty || 1}`),
        ),
        el('div', { class: 'toolbar', style: { marginBottom: 0 } },
          el('span', { class: 'small muted', text: 'Voorraad bijwerken:' }),
          quickStock(part, -1), quickStock(part, +1), quickStock(part, +10),
          el('button', { class: 'btn sm', type: 'button', onClick: () => openStockDialog(part) }, 'Aantal tellen…'),
        ),
      ),
    ),
    el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Gegevens' })),
      el('div', { class: 'card-body' },
        el('dl', { class: 'spec' },
          spec('Artikelnummer', part.number),
          spec('Categorie', part.category || '–'),
          spec('Leverancier', part.supplier || '–'),
          spec('Locatie magazijn', part.location || '–'),
          spec('Eenheid', part.unit),
          spec('Opmerking', part.notes || '–'),
        ),
      ),
    ),
    el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Staat op kastlijsten' })),
      usedOn.length
        ? el('div', { class: 'card-body tight' }, usedOn.map((list) => {
          const line = list.lines.find((l) => l.partId === part.id);
          return el('div', { class: 'list-card', onClick: () => navigate(`/kastlijsten/${list.id}`) },
            cabinetTag(list.cabinetNumber),
            el('div', { class: 'info' }, el('h3', { text: list.title || 'Kastlijst' }),
              el('div', { class: 'meta', text: `${line.qty} ${part.unit} nodig` })),
            icon('next'),
          );
        }))
        : el('div', { class: 'card-body' }, el('p', { class: 'muted small', text: 'Dit onderdeel staat nu niet op een openstaande kastlijst.' })),
    ),
    history.length ? el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h2', { text: 'Historie' })),
      el('div', { class: 'card-body' }, el('div', { class: 'timeline' }, history.map((entry) =>
        el('div', { class: 'item' },
          el('span', { class: `dot ${entry.type}` }),
          el('span', { text: entry.text }),
          el('span', { class: 'when', text: formatAgo(entry.at), title: formatDateTime(entry.at) }),
        )))),
    ) : null,
  );

  return {
    title: part.name,
    subtitle: `${part.number} · ${part.category || 'geen categorie'}`,
    node: el('div', {}, backButton(), el('div', { class: 'detail-grid' }, left, right)),
  };
}

function backButton() {
  return el('button', { class: 'btn ghost', type: 'button', style: { marginBottom: '14px' }, onClick: () => navigate('/onderdelen') }, icon('back'), 'Terug naar onderdelen');
}

function kpi(label, value, sub, tone = '') {
  return el('div', { class: `kpi ${tone}`.trim() },
    el('div', { class: 'label', text: label }),
    el('div', { class: 'value', text: String(value) }),
    sub ? el('div', { class: 'sub', text: sub }) : null,
  );
}

function spec(term, value) {
  return el('div', { style: { display: 'contents' } }, el('dt', { text: term }), el('dd', { text: value }));
}

function quickStock(part, delta) {
  return el('button', {
    class: 'btn sm', type: 'button',
    onClick: async () => {
      try {
        await api(`/api/parts/${part.id}/stock`, { method: 'POST', body: { delta, reason: 'snelle correctie' } });
        await loadData();
        rerender();
      } catch (err) {
        toast(err.message, 'error');
      }
    },
  }, delta > 0 ? `+${delta}` : String(delta));
}

/* ------------------------------------------------------------------ dialogen */

function openStockDialog(part) {
  const input = el('input', { class: 'input', type: 'number', value: String(part.stock), min: '0' });
  const reason = el('input', { class: 'input', type: 'text', placeholder: 'bijv. geteld in het magazijn' });
  openModal({
    title: `Voorraad tellen – ${part.name}`,
    body: el('div', { class: 'form-grid' },
      field('Werkelijk aantal in het magazijn', input),
      field('Reden', reason),
    ),
    actions: [
      { label: 'Annuleren' },
      {
        label: 'Opslaan', tone: 'primary',
        onClick: async (close) => {
          try {
            await api(`/api/parts/${part.id}/stock`, { method: 'POST', body: { set: Number(input.value), reason: reason.value || 'geteld' } });
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

async function removePart(part) {
  const ok = await confirmDialog({
    title: 'Onderdeel verwijderen?',
    text: `${part.name} (${part.number}) wordt uit de lijst gehaald. Dit kan niet ongedaan gemaakt worden.`,
    confirmLabel: 'Verwijderen',
  });
  if (!ok) return;
  try {
    await api(`/api/parts/${part.id}`, { method: 'DELETE' });
    await loadData();
    navigate('/onderdelen');
    toast('Onderdeel verwijderd', 'ok');
  } catch (err) {
    toast(err.message, 'error');
  }
}

export function openPartDialog(part) {
  const existing = part || {};
  const photo = { value: existing.photo || '' };
  const preview = el('img', { class: 'thumb lg', src: photo.value || '/img/parts/placeholder.svg', alt: '' });

  const fileInput = el('input', {
    type: 'file', accept: 'image/*', style: { display: 'none' },
    onChange: async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const dataUrl = await readFile(file);
        const result = await api('/api/uploads', { method: 'POST', body: { dataUrl } });
        photo.value = result.path;
        preview.src = result.path;
        toast('Foto toegevoegd', 'ok');
      } catch (err) {
        toast(err.message, 'error');
      }
    },
  });

  const inputs = {
    number: el('input', { class: 'input', value: existing.number || '', placeholder: 'bijv. SCH-1101' }),
    name: el('input', { class: 'input', value: existing.name || '', placeholder: 'bijv. Potscharnier 110° opdek' }),
    category: el('input', { class: 'input', value: existing.category || '', list: 'categorie-lijst', placeholder: 'bijv. Scharnieren' }),
    unit: el('input', { class: 'input', value: existing.unit || 'stuks', placeholder: 'stuks, set, doos' }),
    supplier: el('input', { class: 'input', value: existing.supplier || '', list: 'leverancier-lijst' }),
    location: el('input', { class: 'input', value: existing.location || '', placeholder: 'bijv. A1-01' }),
    stock: el('input', { class: 'input', type: 'number', value: String(existing.stock ?? 0), min: '0' }),
    minStock: el('input', { class: 'input', type: 'number', value: String(existing.minStock ?? 0), min: '0' }),
    orderQty: el('input', { class: 'input', type: 'number', value: String(existing.orderQty ?? 0), min: '0' }),
    notes: el('textarea', { class: 'textarea', value: existing.notes || '' }),
  };

  const data = state.data || { categories: [], suppliers: [] };
  const body = el('div', {},
    el('datalist', { id: 'categorie-lijst' }, data.categories.map((c) => el('option', { value: c }))),
    el('datalist', { id: 'leverancier-lijst' }, data.suppliers.map((s) => el('option', { value: s }))),
    el('div', { class: 'form-grid' },
      field('Artikelnummer', inputs.number),
      field('Naam', inputs.name),
      field('Categorie', inputs.category),
      field('Eenheid', inputs.unit),
      field('Leverancier', inputs.supplier),
      field('Locatie magazijn', inputs.location),
      field('Voorraad nu', inputs.stock),
      field('Bestelpunt', inputs.minStock, 'Onder dit aantal moet Roy bestellen'),
      field('Standaard bestelaantal', inputs.orderQty),
      el('div', { class: 'field full' },
        el('span', { text: 'Foto' }),
        el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
          preview,
          el('button', { class: 'btn', type: 'button', onClick: () => fileInput.click() }, icon('camera'), 'Foto kiezen'),
          photo.value ? el('button', {
            class: 'btn ghost', type: 'button',
            onClick: (event) => { photo.value = ''; preview.src = '/img/parts/placeholder.svg'; event.target.remove(); },
          }, 'Verwijderen') : null,
          fileInput,
        ),
      ),
      el('div', { class: 'field full' }, el('span', { text: 'Opmerking' }), inputs.notes),
    ),
  );

  openModal({
    title: part ? 'Onderdeel wijzigen' : 'Nieuw onderdeel',
    wide: true,
    body,
    actions: [
      { label: 'Annuleren' },
      {
        label: part ? 'Opslaan' : 'Toevoegen', tone: 'primary',
        onClick: async (close) => {
          const payload = {
            number: inputs.number.value,
            name: inputs.name.value,
            category: inputs.category.value,
            unit: inputs.unit.value,
            supplier: inputs.supplier.value,
            location: inputs.location.value,
            stock: Number(inputs.stock.value),
            minStock: Number(inputs.minStock.value),
            orderQty: Number(inputs.orderQty.value),
            notes: inputs.notes.value,
            photo: photo.value,
          };
          try {
            const saved = part
              ? await api(`/api/parts/${part.id}`, { method: 'PATCH', body: payload })
              : await api('/api/parts', { method: 'POST', body: payload });
            await loadData();
            close();
            toast(part ? 'Onderdeel bijgewerkt' : 'Onderdeel toegevoegd', 'ok');
            if (!part) navigate(`/onderdelen/${saved.id}`);
            else rerender();
          } catch (err) {
            toast(err.message, 'error');
          }
        },
      },
    ],
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('De foto kon niet gelezen worden.'));
    reader.readAsDataURL(file);
  });
}
