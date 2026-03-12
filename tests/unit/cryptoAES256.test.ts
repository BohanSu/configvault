import { describe, it, expect } from 'vitest';
import { generateKey, encryptAES256GCM, decryptAES256GCM } from '../../src/cryptoAES256.ts';

describe('CryptoAES256', () => {
  it('should generate a 32-byte key', () => {
    const key = generateKey();
    expect(key.length).toBe(32);
  });

  it('should encrypt and decrypt correctly', () => {
    const key = Buffer.alloc(32, '0');
    const plaintext = 'secret value';
    const encrypted = encryptAES256GCM(key, plaintext);
    const decrypted = decryptAES256GCM(key, encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('should produce different ciphertext for same plaintext', () => {
    const key = Buffer.alloc(32, '0');
    const plaintext = 'secret value';
    const enc1 = encryptAES256GCM(key, plaintext);
    const enc2 = encryptAES256GCM(key, plaintext);
    expect(enc1).not.toBe(enc2);
  });

  it('should throw on invalid encrypted format', () => {
    const key = Buffer.alloc(32, '0');
    expect(() => decryptAES256GCM(key, 'invalid')).toThrow();
  });
});
