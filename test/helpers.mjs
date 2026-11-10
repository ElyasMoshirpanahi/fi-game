// Shared test helpers. New tests import these; older files keep their local copies for now.
export const reducer = (engine, content) => (s, ...actions) => actions.reduce((st, a) => engine.reduce(st, a, content), s);
export const fakeStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _map: m };
};
