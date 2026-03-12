import { describe, it, expect } from 'vitest';
import { formatAsJSON, formatAsShellExport, formatDiffAsJSON } from '../../src/outputFormatter.ts';

describe('OutputFormatter', () => {
  it('should format env as JSON', () => {
    const env = { KEY: 'value' };
    const output = formatAsJSON(env);
    const parsed = JSON.parse(output);
    expect(parsed.KEY).toBe('value');
  });

  it('should format env as shell export', () => {
    const env = { KEY: 'value' };
    const output = formatAsShellExport(env);
    expect(output).toContain('export KEY=value');
  });

  it('should quote values with spaces in shell format', () => {
    const env = { KEY: 'value with spaces' };
    const output = formatAsShellExport(env);
    expect(output).toContain('export KEY="value with spaces"');
  });

  it('should sort keys in shell format', () => {
    const env = { B: 'b', A: 'a', C: 'c' };
    const output = formatAsShellExport(env);
    const lines = output.split('\n');
    expect(lines[0]).toContain('A=');
    expect(lines[1]).toContain('B=');
    expect(lines[2]).toContain('C=');
  });

  it('should format diff as JSON', () => {
    const diff = { added: ['A'], removed: ['B'], changed: [] };
    const output = formatDiffAsJSON(diff);
    const parsed = JSON.parse(output);
    expect(parsed.added).toEqual(['A']);
  });
});
