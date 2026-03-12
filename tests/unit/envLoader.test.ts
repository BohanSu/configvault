import { describe, it, expect } from 'vitest';
import { parseEnvContent } from '../../src/envLoader.ts';

describe('EnvLoader', () => {
  it('should parse simple key=value pairs', () => {
    const content = 'KEY1=value1\nKEY2=value2';
    const env = parseEnvContent(content);
    expect(env.KEY1).toBe('value1');
    expect(env.KEY2).toBe('value2');
  });

  it('should ignore comments', () => {
    const content = '# This is a comment\nKEY=value';
    const env = parseEnvContent(content);
    expect(env.KEY).toBe('value');
  });

  it('should ignore blank lines', () => {
    const content = '\n\nKEY=value\n\n';
    const env = parseEnvContent(content);
    expect(env.KEY).toBe('value');
  });

  it('should strip quotes from values', () => {
    const content = 'KEY1="value1"\nKEY2=\'value2\'';
    const env = parseEnvContent(content);
    expect(env.KEY1).toBe('value1');
    expect(env.KEY2).toBe('value2');
  });
});
