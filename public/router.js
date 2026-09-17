// Navigatie via de adresbalk (#/onderdelen/on_123).

let rerenderFn = () => {};
let held = false;

/** Schermen met invulvelden zetten dit aan, zodat automatisch verversen
 *  het werk van Dean of Roy niet onder handen wegtrekt. */
export function holdView(value) {
  held = Boolean(value);
}

export function isHeld() {
  return held;
}

export function setRerender(fn) {
  rerenderFn = fn;
}

export function rerender() {
  rerenderFn();
}

export function navigate(path) {
  const target = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash === target) rerender();
  else window.location.hash = target;
}

export function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/overzicht';
}

export function currentSegments() {
  return currentPath().split('/').filter(Boolean).map(decodeURIComponent);
}
