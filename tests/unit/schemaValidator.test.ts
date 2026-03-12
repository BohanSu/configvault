import { describe, it, expect } from 'vitest';
import { validateEnv } from '../../src/schemaValidator.ts';

describe('SchemaValidator', () => {
  it('should validate a correct env', () => {
    const env = { STR: 'value', NUM: '123', BOOL: 'true' };
    const schema = { STR: 'string', NUM: 'number', BOOL: 'boolean' };
    const result = validateEnv(env, schema);
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing keys', () => {
    const env = { STR: 'value' };
    const schema = { STR: 'string', NUM: 'number' };
    const result = validateEnv(env, schema);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate number types', () => {
    const env = { NUM: 'invalid' };
    const schema = { NUM: 'number' };
    const result = validateEnv(env, schema);
    expect(result.ok).toBe(false);
  });

  it('should validate boolean types', () => {
    const env = { BOOL: 'maybe' };
    const schema = { BOOL: 'boolean' };
    const result = validateEnv(env, schema);
    expect(result.ok).toBe(false);
  });
});
