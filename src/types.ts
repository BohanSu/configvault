export type EnvMap = Record<string, string>;

export type SchemaMap = Record<string, 'string' | 'number' | 'boolean'>;

export interface DiffResult {
  added: string[];
  removed: string[];
  changed: Array<{ key: string; from: string; to: string }>;
}

export interface EncryptedValue {
  iv: string;
  tag: string;
  ciphertext: string;
}
