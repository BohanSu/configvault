import { describe, it, expect } from 'vitest';
import { diffEnvs } from '../../src/configDiffer.ts';

describe('ConfigDiffer', () => {
  it('should detect added keys', () => {
    const a = {};
    const b = { NEW: 'value' };
    const diff = diffEnvs(a, b);
    expect(diff.added).toContain('NEW');
  });

  it('should detect removed keys', () => {
    const a = { OLD: 'value' };
    const b = {};
    const diff = diffEnvs(a, b);
    expect(diff.removed).toContain('OLD');
  });

  it('should detect changed keys', () => {
    const a = { KEY: 'old' };
    const b = { KEY: 'new' };
    const diff = diffEnvs(a, b);
    expect(diff.changed).toHaveLength(1);
    expect(diff.changed[0].key).toBe('KEY');
    expect(diff.changed[0].from).toBe('old');
    expect(diff.changed[0].to).toBe('new');
  });

  it('should detect no diff for identical envs', () => {
    const a = { KEY: 'same' };
    const b = { KEY: 'same' };
    const diff = diffEnvs(a, b);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
    expect(diff.changed).toHaveLength(0);
  });
});
