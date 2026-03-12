import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export function generateKey(): Buffer {
  return randomBytes(32);
}

export function encryptAES256GCM(key: Buffer, plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');

  const tag = cipher.getAuthTag();

  const ivBase64 = iv.toString('base64');
  const tagBase64 = tag.toString('base64');

  return `ENC(${ivBase64}:${tagBase64}:${ciphertext})`;
}

export function decryptAES256GCM(key: Buffer, encrypted: string): string {
  const match = encrypted.match(/^ENC\((.+):(.+):(.+)\)$/);
  if (!match) {
    throw new Error('Invalid encrypted format');
  }

  const iv = Buffer.from(match[1], 'base64');
  const tag = Buffer.from(match[2], 'base64');
  const ciphertext = match[3];

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
}
