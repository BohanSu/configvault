import type { EnvMap } from './types.js';

export function mergeEnvs(base: EnvMap, overlays: EnvMap[]): EnvMap {
  const merged = { ...base };

  for (const overlay of overlays) {
    for (const [key, value] of Object.entries(overlay)) {
      merged[key] = value;
    }
  }

  return merged;
}
