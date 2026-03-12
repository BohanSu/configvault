import { describe, it, expect } from 'vitest';
import { mergeEnvs } from '../../src/configMerger.ts';

describe('ConfigMerger', () => {
  it('should merge overlays over base', () => {
    const base = { A: 'a' };
    const overlays = [{ A: 'new_a', B: 'b' }];
    const merged = mergeEnvs(base, overlays);
    expect(merged.A).toBe('new_a');
    expect(merged.B).toBe('b');
  });

  it('should preserve base keys not in overlays', () => {
    const base = { A: 'a', B: 'b' };
    const overlays = [{ A: 'new_a' }];
    const merged = mergeEnvs(base, overlays);
    expect(merged.A).toBe('new_a');
    expect(merged.B).toBe('b');
  });

  it('should handle empty overlays', () => {
    const base = { A: 'a' };
    const overlays = [];
    const merged = mergeEnvs(base, overlays);
    expect(merged.A).toBe('a');
  });

  it('should apply overlays in order', () => {
    const base = { A: 'a' };
    const overlays = [{ A: 'first' }, { A: 'second' }];
    const merged = mergeEnvs(base, overlays);
    expect(merged.A).toBe('second');
  });
});
