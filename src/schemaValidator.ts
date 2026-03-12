import type { EnvMap, SchemaMap } from './types.js';

export function validateEnv(env: EnvMap, schema: SchemaMap): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    if (!(key in env)) {
      errors.push(`Missing required key: ${key}`);
      continue;
    }

    const value = env[key];

    if (expectedType === 'number') {
      if (isNaN(Number(value))) {
        errors.push(`${key}: expected number, got "${value}"`);
      }
    } else if (expectedType === 'boolean') {
      const lower = value.toLowerCase();
      if (lower !== 'true' && lower !== 'false' &&
          value !== '1' && value !== '0' &&
          value !== 'yes' && value !== 'no') {
        errors.push(`${key}: expected boolean, got "${value}"`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
