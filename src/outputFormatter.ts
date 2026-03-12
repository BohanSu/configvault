import type { EnvMap, DiffResult } from './types.js';

export function formatAsJSON(env: EnvMap): string {
  return JSON.stringify(env, null, 2);
}

export function formatAsShellExport(env: EnvMap): string {
  const lines: string[] = [];

  const sortedKeys = Object.keys(env).sort();

  for (const key of sortedKeys) {
    let value = env[key];

    if (value.includes(' ') || value.includes("'") || value.includes('"')) {
      value = `"${value.replace(/"/g, '\\"')}"`;
    }

    lines.push(`export ${key}=${value}`);
  }

  return lines.join('\n');
}

export function formatDiffAsJSON(diff: DiffResult): string {
  return JSON.stringify(diff, null, 2);
}
