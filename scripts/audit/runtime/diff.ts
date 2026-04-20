// Structural diff over two GameStates. The harness hands us `{ before, after }`
// and we return the list of dotted paths whose values changed. A paired
// classifier (classifier.ts) maps those paths to touch-classes the scanner
// can reason about.
//
// Design choice: the diff is path-granular, not value-granular. Scans care
// that `treasury.balance` changed, not whether it went up or down by how
// much — surface-vs-structural classification only needs the path. This
// keeps the output stable across RNG-varied engine calls.

export interface DiffedPath {
  /** Dotted path into GameState, e.g. `treasury.balance` or `persistentConsequences.length`. */
  path: string;
  /** `'add' | 'remove' | 'change'` — shape of the mutation. */
  kind: 'add' | 'remove' | 'change';
}

const MAX_DEPTH = 8;

export function diffStates(before: unknown, after: unknown): DiffedPath[] {
  const out: DiffedPath[] = [];
  walk(before, after, '', 0, out);
  return out;
}

function walk(
  before: unknown,
  after: unknown,
  path: string,
  depth: number,
  out: DiffedPath[],
): void {
  if (depth > MAX_DEPTH) return;
  if (Object.is(before, after)) return;

  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length !== after.length) {
      out.push({ path: `${path}.length`, kind: 'change' });
    }
    const max = Math.max(before.length, after.length);
    for (let i = 0; i < max; i++) {
      const b = before[i];
      const a = after[i];
      if (i >= before.length) {
        out.push({ path: `${path}[${i}]`, kind: 'add' });
        continue;
      }
      if (i >= after.length) {
        out.push({ path: `${path}[${i}]`, kind: 'remove' });
        continue;
      }
      walk(b, a, `${path}[${i}]`, depth + 1, out);
    }
    return;
  }

  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set<string>([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      const nextPath = path === '' ? key : `${path}.${key}`;
      if (!(key in before)) {
        out.push({ path: nextPath, kind: 'add' });
        continue;
      }
      if (!(key in after)) {
        out.push({ path: nextPath, kind: 'remove' });
        continue;
      }
      walk(before[key], after[key], nextPath, depth + 1, out);
    }
    return;
  }

  if (before !== after) {
    out.push({ path: path === '' ? '(root)' : path, kind: 'change' });
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}
