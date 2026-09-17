// Afgeleide gegevens: voorraadstatus, reserveringen en besteladvies.
// Deze module bevat geen I/O zodat de rekenregels los te testen zijn.

export const PART_STATUS = {
  out: { label: 'Op', tone: 'danger' },
  order: { label: 'Bestellen', tone: 'warn' },
  ordered: { label: 'Besteld', tone: 'info' },
  ok: { label: 'Op voorraad', tone: 'ok' },
};

/** Lijsten die nog gepakt moeten worden houden voorraad bezet. */
export const OPEN_PICKLIST_STATUSES = ['open', 'busy'];

export function isOpenPicklist(list) {
  return OPEN_PICKLIST_STATUSES.includes(list.status);
}

/** Aantal stuks dat op nog te pakken kastlijsten staat, per onderdeel. */
export function reservedByPart(picklists) {
  const map = new Map();
  for (const list of picklists) {
    if (!isOpenPicklist(list)) continue;
    for (const line of list.lines) {
      const open = Math.max(0, num(line.qty) - num(line.pickedQty));
      if (open > 0) map.set(line.partId, (map.get(line.partId) || 0) + open);
    }
  }
  return map;
}

/** Door Dean gemelde tekorten die Roy nog niet heeft afgehandeld, per onderdeel. */
export function shortagesByPart(picklists) {
  const map = new Map();
  for (const list of picklists) {
    for (const line of list.lines) {
      const missing = num(line.missingQty);
      if (missing <= 0 || line.missingHandled) continue;
      const entry = map.get(line.partId) || { qty: 0, lists: [] };
      entry.qty += missing;
      entry.lists.push({ id: list.id, cabinetNumber: list.cabinetNumber, qty: missing, at: list.completedAt });
      map.set(line.partId, entry);
    }
  }
  return map;
}

/** Stuks die al besteld zijn maar nog niet binnen, per onderdeel. */
export function onOrderByPart(orders) {
  const map = new Map();
  for (const order of orders) {
    if (order.status !== 'open') continue;
    map.set(order.partId, (map.get(order.partId) || 0) + num(order.qty));
  }
  return map;
}

export function partStatus({ available, minStock, onOrder }) {
  if (available <= 0) return 'out';
  if (available <= minStock) return onOrder > 0 ? 'ordered' : 'order';
  return 'ok';
}

/**
 * Besteladvies: vul aan tot twee keer het bestelpunt, minimaal de
 * standaard bestelhoeveelheid, plus wat er al tekort is gemeld.
 */
export function suggestedOrderQty(part, { available, shortage, onOrder }) {
  const target = num(part.minStock) * 2;
  const gap = target - available - onOrder + shortage;
  return Math.max(num(part.orderQty) || 1, Math.ceil(gap), 1);
}

/** Verrijkt elk onderdeel met reservering, status en besteladvies. */
export function enrichParts(db) {
  const reserved = reservedByPart(db.picklists);
  const shortages = shortagesByPart(db.picklists);
  const onOrder = onOrderByPart(db.orders);

  return db.parts.map((part) => {
    const stock = num(part.stock);
    const res = reserved.get(part.id) || 0;
    const short = shortages.get(part.id);
    const ordered = onOrder.get(part.id) || 0;
    const available = stock - res;
    const context = {
      available,
      minStock: num(part.minStock),
      onOrder: ordered,
      shortage: short ? short.qty : 0,
    };
    return {
      ...part,
      stock,
      reserved: res,
      available,
      onOrder: ordered,
      shortage: context.shortage,
      shortageLists: short ? short.lists : [],
      status: partStatus(context),
      suggestedOrderQty: suggestedOrderQty(part, context),
    };
  });
}

/** Alles wat Roy moet bestellen, met de dringendste bovenaan. */
export function orderAdvice(parts) {
  const rank = { out: 0, order: 1, ordered: 2 };
  return parts
    .filter((p) => p.status !== 'ok' || p.shortage > 0)
    .sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || a.available - b.available);
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
