import type { EnvMap, DiffResult } from './types.js';

export function diffEnvs(a: EnvMap, b: EnvMap): DiffResult {
  const aKeys = new Set(Object.keys(a));
  const bKeys = new Set(Object.keys(b));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: Array<{ key: string; from: string; to: string }> = [];

  for (const key of bKeys) {
    if (!aKeys.has(key)) {
      added.push(key);
    } else if (a[key] !== b[key]) {
      changed.push({ key, from: a[key]!, to: b[key]! });
    }
  }

  for (const key of aKeys) {
    if (!bKeys.has(key)) {
      removed.push(key);
    }
  }

  return { added, removed, changed };
}
