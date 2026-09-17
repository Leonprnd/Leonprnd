// Startpunt: menu, navigatie en het automatisch bijwerken van de gegevens.

import { loadData, onChange, openPicklists, setUser, state, toOrder, USERS } from './data.js';
import { clear, el, icon, modalsOpen, toast } from './ui.js';
import { currentSegments, holdView, isHeld, navigate, setRerender } from './router.js';
import * as overzicht from './views/dashboard.js';
import * as onderdelen from './views/parts.js';
import * as kastlijsten from './views/picklists.js';
import * as pakken from './views/pick.js';
import * as bestellen from './views/orders.js';
import * as historie from './views/history.js';

const PAGES = {
  overzicht: { label: 'Overzicht', icon: 'dashboard', view: overzicht },
  onderdelen: { label: 'Onderdelen', icon: 'parts', view: onderdelen },
  kastlijsten: { label: 'Kastlijsten', icon: 'list', view: kastlijsten, badge: () => openPicklists().length },
  pakken: { label: 'Pakken', icon: 'pick', view: pakken, badge: () => openPicklists().length },
  bestellen: {
    label: 'Bestellen',
    icon: 'order',
    view: bestellen,
    badge: () => toOrder().length,
    alert: () => toOrder().some((part) => part.status === 'out' || part.shortage > 0),
  },
  historie: { label: 'Historie', icon: 'history', view: historie },
};

const viewHost = document.getElementById('view');
const navHost = document.getElementById('nav');
const titleHost = document.getElementById('page-title');
const syncHost = document.getElementById('sync-state');
const sidebar = document.querySelector('.sidebar');

function renderNav() {
  const active = currentSegments()[0] || 'overzicht';
  clear(navHost);
  navHost.append(el('div', { class: 'nav-section', text: 'Werkplaats' }));
  for (const [key, page] of Object.entries(PAGES)) {
    if (key === 'bestellen') navHost.append(el('div', { class: 'nav-section', text: 'Inkoop' }));
    const count = page.badge ? page.badge() : 0;
    navHost.append(
      el('a', { href: `#/${key}`, class: key === active ? 'active' : '' },
        icon(page.icon),
        el('span', { text: page.label }),
        count ? el('span', { class: `badge${page.alert && page.alert() ? ' alert' : ''}`, text: String(count) }) : null,
      ),
    );
  }
}

function renderSync() {
  syncHost.className = `sync ${state.status === 'error' ? 'error' : state.status === 'busy' ? 'busy' : ''}`.trim();
  if (state.status === 'error') syncHost.textContent = 'Geen verbinding met de server';
  else if (!state.lastSync) syncHost.textContent = 'Laden…';
  else syncHost.textContent = `Bijgewerkt ${state.lastSync.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
}

function renderView() {
  const segments = currentSegments();
  const page = PAGES[segments[0]];
  holdView(false);
  if (!page) return navigate('/overzicht');

  let result;
  try {
    result = page.view.render(segments.slice(1));
  } catch (err) {
    console.error(err);
    result = { title: 'Er ging iets mis', node: el('div', { class: 'banner danger' }, icon('alert'), err.message) };
  }

  clear(titleHost).append(
    el('h1', { text: result.title || page.label }),
    result.subtitle ? el('span', { text: result.subtitle }) : null,
  );
  document.title = `${result.title || page.label} · Onderdelenbeheer Puuur`;
  clear(viewHost).append(result.node);
  renderNav();
  sidebar.classList.remove('open');
}

/** Bij automatisch verversen niet opnieuw tekenen terwijl iemand iets invult. */
function isBusyTyping() {
  const active = document.activeElement;
  return Boolean(active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName));
}

function renderAll() {
  renderView();
  renderSync();
}

function setupUserSelect() {
  const select = document.getElementById('user-select');
  for (const name of USERS) {
    select.append(el('option', { value: name, text: name, selected: name === state.user }));
  }
  select.addEventListener('change', () => {
    setUser(select.value);
    toast(`Je werkt nu als ${select.value}`);
    renderAll();
  });
}

function setupMenu() {
  document.getElementById('menu-btn').addEventListener('click', () => sidebar.classList.toggle('open'));
}

async function start() {
  setRerender(renderAll);
  setupUserSelect();
  setupMenu();
  renderNav();
  renderSync();
  viewHost.append(el('div', { class: 'empty' }, 'Gegevens laden…'));

  try {
    await loadData();
  } catch (err) {
    toast(err.message, 'error');
  }
  if (!window.location.hash) {
    window.location.hash = state.user === 'Dean' ? '#/pakken' : '#/overzicht';
  }
  renderAll();

  window.addEventListener('hashchange', renderAll);
  onChange(renderSync);

  setInterval(async () => {
    if (document.hidden) return;
    await loadData({ silent: true });
    renderNav();
    renderSync();
    if (!modalsOpen() && !isBusyTyping() && !isHeld()) renderView();
  }, 12000);
}

start();
